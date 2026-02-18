import React, { useState, useCallback, useRef, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { PRESETS, createEmptyGrid, placePreset, nextGeneration, countLiveCells, gridsEqual } from "../utils/gameOfLife";

const GlobalStyle = createGlobalStyle`
  html, body { margin: 0; padding: 0; background: #0d0f11; overflow: hidden; }
`;

const Wrap = styled.div`
  display: flex; flex-direction: column; align-items: center;
  padding: 8px; color: #fff; background: #0d0f11; height: 100vh; box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;
const Controls = styled.div`
  display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; align-items: center;
  margin-bottom: 6px; flex-shrink: 0;
`;
const ControlGroup = styled.div`
  display: flex; flex-direction: column; gap: 1px;
  label { font-size: 0.55rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.05em; }
`;
const Select = styled.select`
  background: #17191b; color: #fff; border: 1px solid rgba(127,161,232,0.4);
  border-radius: 4px; padding: 3px 6px; font-size: 0.7rem; cursor: pointer;
`;
const Slider = styled.input`accent-color: #7fa1e8; width: 60px;`;
const Btn = styled.button`
  background: ${p => p.$primary ? '#7fa1e8' : 'rgba(127,161,232,0.15)'};
  color: #fff; border: 1px solid rgba(127,161,232,0.4); border-radius: 4px;
  padding: 3px 10px; font-size: 0.7rem; cursor: pointer;
  &:hover { background: ${p => p.$primary ? '#5b88d4' : 'rgba(127,161,232,0.3)'}; }
`;
const CanvasWrap = styled.div`
  flex: 1; display: flex; align-items: center; justify-content: center;
  width: 100%; min-height: 0; position: relative;
`;
const Stats = styled.div`
  display: flex; gap: 14px; padding: 4px 0; font-size: 0.65rem;
  color: rgba(255,255,255,0.5); flex-shrink: 0;
  span { color: #7fa1e8; font-weight: bold; }
`;
const Overlay = styled.div`
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  background: rgba(13,15,17,0.88); border-radius: 4px; z-index: 10;
`;
const OverlayTitle = styled.h2`
  color: #7fa1e8; margin: 0 0 8px; font-size: 1.1rem;
`;
const OverlayStat = styled.div`
  color: rgba(255,255,255,0.7); font-size: 0.75rem; margin: 2px 0;
  span { color: #7fa1e8; font-weight: bold; }
`;
const OverlayBtn = styled(Btn)`
  margin-top: 12px; padding: 6px 16px; font-size: 0.75rem;
`;

const GameOfLifeEmbed = () => {
  const [gridSize, setGridSize] = useState(30);
  const [preset, setPreset] = useState("random");
  const [speed, setSpeed] = useState(150);
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [cellSize, setCellSize] = useState(14);
  const [gameOver, setGameOver] = useState(null); // null | { reason, generations, peakCells, finalCells, startCells }
  const rows = gridSize, cols = gridSize;

  const [grid, setGrid] = useState(() => {
    const g = createEmptyGrid(30, 30);
    placePreset(g, "random", 30, 30);
    return g;
  });

  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const speedRef = useRef(speed);
  const drawingRef = useRef(false);
  const drawModeRef = useRef(1);
  const peakCellsRef = useRef(0);
  const startCellsRef = useRef(0);
  const prevGridRef = useRef(null);
  speedRef.current = speed;

  // Track peak
  useEffect(() => {
    const live = countLiveCells(grid);
    if (live > peakCellsRef.current) peakCellsRef.current = live;
  }, [grid]);

  // Responsive cell size
  useEffect(() => {
    const resize = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const w = wrap.clientWidth - 8, h = wrap.clientHeight - 8;
      setCellSize(Math.max(4, Math.min(Math.floor(w / cols), Math.floor(h / rows))));
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [rows, cols]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = cols * cellSize, h = rows * cellSize;
    canvas.width = w; canvas.height = h;
    ctx.fillStyle = "#0d0f11"; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(127,161,232,0.06)"; ctx.lineWidth = 0.5;
    for (let r = 0; r <= rows; r++) { ctx.beginPath(); ctx.moveTo(0, r*cellSize); ctx.lineTo(w, r*cellSize); ctx.stroke(); }
    for (let c = 0; c <= cols; c++) { ctx.beginPath(); ctx.moveTo(c*cellSize, 0); ctx.lineTo(c*cellSize, h); ctx.stroke(); }
    ctx.shadowColor = "#7fa1e8";
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (grid[r][c]) {
          ctx.fillStyle = "#7fa1e8"; ctx.shadowBlur = 3;
          ctx.fillRect(c*cellSize+1, r*cellSize+1, cellSize-2, cellSize-2);
        }
    ctx.shadowBlur = 0;
  }, [grid, rows, cols, cellSize]);

  // Simulation loop with end detection
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setGrid(g => {
        const next = nextGeneration(g, rows, cols);
        const liveCells = countLiveCells(next);

        // Extinction
        if (liveCells === 0) {
          setRunning(false);
          setGameOver({
            reason: "Extinction — all cells died",
            generations: generation + 1,
            peakCells: peakCellsRef.current,
            finalCells: 0,
            startCells: startCellsRef.current,
          });
          return next;
        }

        // Stasis — grid unchanged (still life or period-1 oscillator)
        if (gridsEqual(g, next, rows, cols)) {
          setRunning(false);
          setGameOver({
            reason: "Stasis — stable state reached",
            generations: generation + 1,
            peakCells: peakCellsRef.current,
            finalCells: liveCells,
            startCells: startCellsRef.current,
          });
          return next;
        }

        // Period-2 oscillator detection
        if (prevGridRef.current && gridsEqual(prevGridRef.current, next, rows, cols)) {
          setRunning(false);
          setGameOver({
            reason: "Oscillation — repeating cycle detected",
            generations: generation + 1,
            peakCells: peakCellsRef.current,
            finalCells: liveCells,
            startCells: startCellsRef.current,
          });
          return next;
        }

        prevGridRef.current = g;
        setGeneration(gen => gen + 1);
        return next;
      });
    }, speedRef.current);
    return () => clearInterval(id);
  }, [running, speed, rows, cols, generation]);

  // Drawing
  const getCellFromEvent = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    const c = Math.floor((cx - rect.left) * sx / cellSize);
    const r = Math.floor((cy - rect.top) * sy / cellSize);
    if (r >= 0 && r < rows && c >= 0 && c < cols) return { r, c };
    return null;
  }, [rows, cols, cellSize]);

  const toggleCell = useCallback((r, c, mode) => {
    setGrid(prev => { const copy = prev.map(row => new Uint8Array(row)); copy[r][c] = mode; return copy; });
  }, []);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    const cell = getCellFromEvent(e);
    if (!cell) return;
    drawingRef.current = true;
    drawModeRef.current = grid[cell.r][cell.c] ? 0 : 1;
    toggleCell(cell.r, cell.c, drawModeRef.current);
  }, [getCellFromEvent, grid, toggleCell]);

  const handlePointerMove = useCallback((e) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const cell = getCellFromEvent(e);
    if (cell) toggleCell(cell.r, cell.c, drawModeRef.current);
  }, [getCellFromEvent, toggleCell]);

  const handlePointerUp = useCallback(() => { drawingRef.current = false; }, []);

  useEffect(() => {
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchend", handlePointerUp);
    return () => { window.removeEventListener("mouseup", handlePointerUp); window.removeEventListener("touchend", handlePointerUp); };
  }, [handlePointerUp]);

  const resetGame = (newPreset) => {
    const p = newPreset || preset;
    setRunning(false); setGeneration(0); setGameOver(null);
    peakCellsRef.current = 0; prevGridRef.current = null;
    const g = createEmptyGrid(rows, cols);
    placePreset(g, p, rows, cols);
    startCellsRef.current = countLiveCells(g);
    peakCellsRef.current = startCellsRef.current;
    setGrid(g);
  };

  const handleGridSizeChange = (s) => {
    setGridSize(s); setRunning(false); setGeneration(0); setGameOver(null);
    peakCellsRef.current = 0; prevGridRef.current = null;
    const g = createEmptyGrid(s, s);
    placePreset(g, preset, s, s);
    startCellsRef.current = countLiveCells(g);
    peakCellsRef.current = startCellsRef.current;
    setGrid(g);
  };

  const handlePresetChange = (p) => { setPreset(p); resetGame(p); };

  const handlePlay = () => {
    if (!running && !gameOver) {
      if (generation === 0) startCellsRef.current = countLiveCells(grid);
      prevGridRef.current = null;
    }
    setRunning(!running);
  };

  const liveCells = countLiveCells(grid);

  return (
    <>
      <GlobalStyle />
      <Wrap>
        <Controls>
          <ControlGroup>
            <label>Pattern</label>
            <Select value={preset} onChange={e => handlePresetChange(e.target.value)}>
              {Object.entries(PRESETS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
            </Select>
          </ControlGroup>
          <ControlGroup>
            <label>Grid {gridSize}×{gridSize}</label>
            <Slider type="range" min="10" max="50" value={gridSize} onChange={e => handleGridSizeChange(Number(e.target.value))} />
          </ControlGroup>
          <ControlGroup>
            <label>Speed {speed}ms</label>
            <Slider type="range" min="30" max="500" step="10" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
          </ControlGroup>
          <Btn $primary onClick={handlePlay}>{running ? "⏸" : "▶"}</Btn>
          <Btn onClick={() => resetGame()}>↺</Btn>
          <Btn onClick={() => {
            if (gameOver) return;
            setGrid(g => {
              const next = nextGeneration(g, rows, cols);
              setGeneration(n => n+1);
              return next;
            });
          }}>→</Btn>
        </Controls>
        <CanvasWrap ref={wrapRef}>
          <canvas
            ref={canvasRef}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            style={{ cursor: "crosshair", display: "block", borderRadius: 4, touchAction: "none" }}
          />
          {gameOver && (
            <Overlay>
              <OverlayTitle>🏁 Game Over</OverlayTitle>
              <OverlayStat>{gameOver.reason}</OverlayStat>
              <OverlayStat>Generations: <span>{gameOver.generations}</span></OverlayStat>
              <OverlayStat>Starting cells: <span>{gameOver.startCells}</span></OverlayStat>
              <OverlayStat>Peak cells: <span>{gameOver.peakCells}</span></OverlayStat>
              <OverlayStat>Final cells: <span>{gameOver.finalCells}</span></OverlayStat>
              <OverlayBtn $primary onClick={() => resetGame()}>Play Again</OverlayBtn>
            </Overlay>
          )}
        </CanvasWrap>
        <Stats>
          <div>Gen: <span>{generation}</span></div>
          <div>Live: <span>{liveCells}</span></div>
        </Stats>
      </Wrap>
    </>
  );
};

export default GameOfLifeEmbed;
