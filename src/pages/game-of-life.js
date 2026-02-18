import React, { useState, useCallback, useRef, useEffect } from "react";
import styled from "styled-components";
import Layout from "../components/layout";
import { PRESETS, createEmptyGrid, placePreset, nextGeneration, countLiveCells, gridsEqual } from "../utils/gameOfLife";

const CELL_SIZE = 14;

const PageWrapper = styled.div`
  display: flex; flex-direction: column; align-items: center; padding: 2% 0; color: #fff;
`;
const Title = styled.h1`
  color: #fff; margin-bottom: 0.3em; font-size: 2rem; text-align: center;
`;
const Subtitle = styled.p`
  color: rgba(255,255,255,0.6); margin-bottom: 1.5em; text-align: center; max-width: 600px; line-height: 1.5;
`;
const Controls = styled.div`
  display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; align-items: center; margin-bottom: 1.2em;
`;
const ControlGroup = styled.div`
  display: flex; flex-direction: column; gap: 2px;
  label { font-size: 0.65rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.05em; }
`;
const Select = styled.select`
  background: #17191b; color: #fff; border: 1px solid rgba(127,161,232,0.4);
  border-radius: 6px; padding: 6px 10px; font-size: 0.85rem; cursor: pointer;
  &:hover { border-color: #7fa1e8; }
`;
const Slider = styled.input`accent-color: #7fa1e8; width: 90px;`;
const Btn = styled.button`
  background: ${p => p.$primary ? '#7fa1e8' : 'rgba(127,161,232,0.15)'};
  color: #fff; border: 1px solid rgba(127,161,232,0.4); border-radius: 6px;
  padding: 6px 14px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
  &:hover { background: ${p => p.$primary ? '#5b88d4' : 'rgba(127,161,232,0.3)'}; }
`;
const CanvasWrapper = styled.div`
  border-radius: 8px; overflow: hidden; background: #0d0f11; cursor: crosshair; max-width: 90vw;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
  position: relative;
`;
const Stats = styled.div`
  display: flex; gap: 20px; margin-top: 1em; font-size: 0.8rem; color: rgba(255,255,255,0.5);
  span { color: #7fa1e8; font-weight: bold; }
`;
const Overlay = styled.div`
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  background: rgba(13,15,17,0.9); border-radius: 8px; z-index: 10;
`;
const OverlayTitle = styled.h2`color: #7fa1e8; margin: 0 0 12px; font-size: 1.4rem;`;
const OverlayStat = styled.div`
  color: rgba(255,255,255,0.7); font-size: 0.9rem; margin: 3px 0;
  span { color: #7fa1e8; font-weight: bold; }
`;
const OverlayBtn = styled(Btn)`margin-top: 16px; padding: 8px 20px;`;

const GameOfLife = () => {
  const [gridSize, setGridSize] = useState(30);
  const [preset, setPreset] = useState("random");
  const [speed, setSpeed] = useState(150);
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [gameOver, setGameOver] = useState(null);
  const rows = gridSize, cols = gridSize;

  const [grid, setGrid] = useState(() => {
    const g = createEmptyGrid(30, 30);
    placePreset(g, "random", 30, 30);
    return g;
  });

  const canvasRef = useRef(null);
  const speedRef = useRef(speed);
  const drawingRef = useRef(false);
  const drawModeRef = useRef(1);
  const peakCellsRef = useRef(0);
  const startCellsRef = useRef(0);
  const prevGridRef = useRef(null);
  speedRef.current = speed;

  useEffect(() => {
    const live = countLiveCells(grid);
    if (live > peakCellsRef.current) peakCellsRef.current = live;
  }, [grid]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = cols * CELL_SIZE, h = rows * CELL_SIZE;
    canvas.width = w; canvas.height = h;
    ctx.fillStyle = "#0d0f11"; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(127,161,232,0.06)"; ctx.lineWidth = 0.5;
    for (let r = 0; r <= rows; r++) { ctx.beginPath(); ctx.moveTo(0, r*CELL_SIZE); ctx.lineTo(w, r*CELL_SIZE); ctx.stroke(); }
    for (let c = 0; c <= cols; c++) { ctx.beginPath(); ctx.moveTo(c*CELL_SIZE, 0); ctx.lineTo(c*CELL_SIZE, h); ctx.stroke(); }
    ctx.shadowColor = "#7fa1e8";
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (grid[r][c]) {
          ctx.fillStyle = "#7fa1e8"; ctx.shadowBlur = 3;
          ctx.fillRect(c*CELL_SIZE+1, r*CELL_SIZE+1, CELL_SIZE-2, CELL_SIZE-2);
        }
    ctx.shadowBlur = 0;
  }, [grid, rows, cols]);

  // Simulation with end detection
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setGrid(g => {
        const next = nextGeneration(g, rows, cols);
        const live = countLiveCells(next);
        const endGame = (reason) => {
          setRunning(false);
          setGameOver({ reason, generations: generation + 1, peakCells: peakCellsRef.current, finalCells: live, startCells: startCellsRef.current });
        };
        if (live === 0) { endGame("Extinction — all cells died"); return next; }
        if (gridsEqual(g, next, rows, cols)) { endGame("Stasis — stable state reached"); return next; }
        if (prevGridRef.current && gridsEqual(prevGridRef.current, next, rows, cols)) { endGame("Oscillation — repeating cycle detected"); return next; }
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
    const c = Math.floor((cx - rect.left) * sx / CELL_SIZE);
    const r = Math.floor((cy - rect.top) * sy / CELL_SIZE);
    if (r >= 0 && r < rows && c >= 0 && c < cols) return { r, c };
    return null;
  }, [rows, cols]);

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
    <Layout>
      <PageWrapper>
        <Title>Conway's Game of Life</Title>
        <Subtitle>
          Select a seed pattern or draw your own shapes by clicking and dragging.
          Adjust speed and grid size, then press Play. The game ends when cells stabilize, oscillate, or go extinct.
        </Subtitle>
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
          <Btn $primary onClick={handlePlay}>{running ? "⏸ Pause" : "▶ Play"}</Btn>
          <Btn onClick={() => resetGame()}>↺ Reset</Btn>
          <Btn onClick={() => {
            if (gameOver) return;
            setGrid(g => { const next = nextGeneration(g, rows, cols); setGeneration(n => n+1); return next; });
          }}>Step →</Btn>
        </Controls>
        <CanvasWrapper>
          <canvas
            ref={canvasRef}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            style={{ display: "block", maxWidth: "100%", height: "auto", touchAction: "none" }}
          />
          {gameOver && (
            <Overlay>
              <OverlayTitle>🏁 Game Over</OverlayTitle>
              <OverlayStat>{gameOver.reason}</OverlayStat>
              <OverlayStat>Generations played: <span>{gameOver.generations}</span></OverlayStat>
              <OverlayStat>Starting cells: <span>{gameOver.startCells}</span></OverlayStat>
              <OverlayStat>Peak live cells: <span>{gameOver.peakCells}</span></OverlayStat>
              <OverlayStat>Final cells: <span>{gameOver.finalCells}</span></OverlayStat>
              <OverlayBtn $primary onClick={() => resetGame()}>Play Again</OverlayBtn>
            </Overlay>
          )}
        </CanvasWrapper>
        <Stats>
          <div>Generation: <span>{generation}</span></div>
          <div>Live Cells: <span>{liveCells}</span></div>
          <div>Grid: <span>{rows}×{cols}</span></div>
        </Stats>
      </PageWrapper>
    </Layout>
  );
};

export default GameOfLife;
