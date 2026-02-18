import React, { useState, useCallback, useRef, useEffect } from "react";
import styled from "styled-components";
import Layout from "../components/layout";

const CELL_SIZE = 16;
const PRESETS = {
  empty: { name: "Empty Grid", cells: [] },
  glider: {
    name: "Glider",
    cells: [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ],
  },
  blinker: {
    name: "Blinker",
    cells: [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
  },
  toad: {
    name: "Toad",
    cells: [
      [1, 1],
      [2, 1],
      [3, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ],
  },
  beacon: {
    name: "Beacon",
    cells: [
      [0, 0],
      [1, 0],
      [0, 1],
      [3, 2],
      [2, 3],
      [3, 3],
    ],
  },
  pulsar: {
    name: "Pulsar",
    cells: (() => {
      const c = [];
      const offsets = [
        [2, 0], [3, 0], [4, 0], [8, 0], [9, 0], [10, 0],
        [0, 2], [5, 2], [7, 2], [12, 2],
        [0, 3], [5, 3], [7, 3], [12, 3],
        [0, 4], [5, 4], [7, 4], [12, 4],
        [2, 5], [3, 5], [4, 5], [8, 5], [9, 5], [10, 5],
        [2, 7], [3, 7], [4, 7], [8, 7], [9, 7], [10, 7],
        [0, 8], [5, 8], [7, 8], [12, 8],
        [0, 9], [5, 9], [7, 9], [12, 9],
        [0, 10], [5, 10], [7, 10], [12, 10],
        [2, 12], [3, 12], [4, 12], [8, 12], [9, 12], [10, 12],
      ];
      offsets.forEach(([x, y]) => c.push([x, y]));
      return c;
    })(),
  },
  gliderGun: {
    name: "Gosper Glider Gun",
    cells: [
      [24, 0],
      [22, 1], [24, 1],
      [12, 2], [13, 2], [20, 2], [21, 2], [34, 2], [35, 2],
      [11, 3], [15, 3], [20, 3], [21, 3], [34, 3], [35, 3],
      [0, 4], [1, 4], [10, 4], [16, 4], [20, 4], [21, 4],
      [0, 5], [1, 5], [10, 5], [14, 5], [16, 5], [17, 5], [22, 5], [24, 5],
      [10, 6], [16, 6], [24, 6],
      [11, 7], [15, 7],
      [12, 8], [13, 8],
    ],
  },
  random: { name: "Random (25%)", cells: "random" },
};

const createEmptyGrid = (rows, cols) =>
  Array.from({ length: rows }, () => new Uint8Array(cols));

const placePreset = (grid, preset, rows, cols) => {
  if (preset === "random") {
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        grid[r][c] = Math.random() < 0.25 ? 1 : 0;
    return;
  }
  const cells = PRESETS[preset]?.cells || [];
  if (typeof cells === "string") return;
  const offsetR = Math.floor(rows / 2) - Math.floor((Math.max(...cells.map(c => c[1]), 0) + 1) / 2);
  const offsetC = Math.floor(cols / 2) - Math.floor((Math.max(...cells.map(c => c[0]), 0) + 1) / 2);
  cells.forEach(([c, r]) => {
    const nr = r + offsetR;
    const nc = c + offsetC;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) grid[nr][nc] = 1;
  });
};

const nextGeneration = (grid, rows, cols) => {
  const next = createEmptyGrid(rows, cols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let neighbors = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols)
            neighbors += grid[nr][nc];
        }
      }
      if (grid[r][c]) {
        next[r][c] = neighbors === 2 || neighbors === 3 ? 1 : 0;
      } else {
        next[r][c] = neighbors === 3 ? 1 : 0;
      }
    }
  }
  return next;
};

// Styled components matching site theme
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2% 0;
  color: #fff;
  min-height: 60vh;
`;

const Title = styled.h1`
  color: #fff;
  margin-bottom: 0.5em;
  font-size: 2rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.5em;
  text-align: center;
  max-width: 600px;
  line-height: 1.5;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5em;
  max-width: 800px;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const Select = styled.select`
  background: #17191b;
  color: #fff;
  border: 1px solid rgba(127, 161, 232, 0.4);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover {
    border-color: #7fa1e8;
  }
`;

const Slider = styled.input`
  accent-color: #7fa1e8;
  width: 100px;
`;

const Btn = styled.button`
  background: ${(p) => (p.$primary ? "#7fa1e8" : "rgba(127,161,232,0.15)")};
  color: #fff;
  border: 1px solid rgba(127, 161, 232, 0.4);
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${(p) => (p.$primary ? "#5b88d4" : "rgba(127,161,232,0.3)")};
  }
`;

const CanvasWrapper = styled.div`
  border-radius: 8px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  background: #0d0f11;
  cursor: crosshair;
`;

const Stats = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 1em;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  span {
    color: #7fa1e8;
    font-weight: bold;
  }
`;

const GameOfLife = () => {
  const [gridSize, setGridSize] = useState(30);
  const [preset, setPreset] = useState("random");
  const [speed, setSpeed] = useState(150);
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);

  const rows = gridSize;
  const cols = gridSize;

  const [grid, setGrid] = useState(() => {
    const g = createEmptyGrid(rows, cols);
    placePreset(g, "random", rows, cols);
    return g;
  });

  const canvasRef = useRef(null);
  const runningRef = useRef(running);
  const gridRef = useRef(grid);
  const speedRef = useRef(speed);

  runningRef.current = running;
  gridRef.current = grid;
  speedRef.current = speed;

  // Draw grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = cols * CELL_SIZE;
    const h = rows * CELL_SIZE;
    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = "#0d0f11";
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = "rgba(127,161,232,0.08)";
    ctx.lineWidth = 0.5;
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL_SIZE);
      ctx.lineTo(w, r * CELL_SIZE);
      ctx.stroke();
    }
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL_SIZE, 0);
      ctx.lineTo(c * CELL_SIZE, h);
      ctx.stroke();
    }

    // Cells
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) {
          ctx.fillStyle = "#7fa1e8";
          ctx.shadowColor = "#7fa1e8";
          ctx.shadowBlur = 4;
          ctx.fillRect(
            c * CELL_SIZE + 1,
            r * CELL_SIZE + 1,
            CELL_SIZE - 2,
            CELL_SIZE - 2
          );
          ctx.shadowBlur = 0;
        }
      }
    }
  }, [grid, rows, cols]);

  // Simulation loop
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setGrid((g) => {
        const next = nextGeneration(g, rows, cols);
        return next;
      });
      setGeneration((gen) => gen + 1);
    }, speedRef.current);
    return () => clearInterval(id);
  }, [running, speed, rows, cols]);

  const handleCanvasClick = useCallback(
    (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const c = Math.floor(((e.clientX - rect.left) * scaleX) / CELL_SIZE);
      const r = Math.floor(((e.clientY - rect.top) * scaleY) / CELL_SIZE);
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        setGrid((prev) => {
          const copy = prev.map((row) => new Uint8Array(row));
          copy[r][c] = copy[r][c] ? 0 : 1;
          return copy;
        });
      }
    },
    [rows, cols]
  );

  const handleReset = () => {
    setRunning(false);
    setGeneration(0);
    const g = createEmptyGrid(rows, cols);
    placePreset(g, preset, rows, cols);
    setGrid(g);
  };

  const handleGridSizeChange = (newSize) => {
    setRunning(false);
    setGeneration(0);
    setGridSize(newSize);
    const g = createEmptyGrid(newSize, newSize);
    placePreset(g, preset, newSize, newSize);
    setGrid(g);
  };

  const handlePresetChange = (newPreset) => {
    setPreset(newPreset);
    setRunning(false);
    setGeneration(0);
    const g = createEmptyGrid(rows, cols);
    placePreset(g, newPreset, rows, cols);
    setGrid(g);
  };

  const liveCells = grid.reduce(
    (sum, row) => sum + row.reduce((s, c) => s + c, 0),
    0
  );

  const canvasWidth = cols * CELL_SIZE;

  return (
    <Layout>
      <PageWrapper>
        <Title>Conway's Game of Life</Title>
        <Subtitle>
          Select a seed pattern, adjust speed and grid size, then press Play.
          Click cells to toggle them manually.
        </Subtitle>

        <Controls>
          <ControlGroup>
            <label>Pattern</label>
            <Select
              value={preset}
              onChange={(e) => handlePresetChange(e.target.value)}
            >
              {Object.entries(PRESETS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.name}
                </option>
              ))}
            </Select>
          </ControlGroup>

          <ControlGroup>
            <label>Grid {gridSize}×{gridSize}</label>
            <Slider
              type="range"
              min="10"
              max="60"
              value={gridSize}
              onChange={(e) => handleGridSizeChange(Number(e.target.value))}
            />
          </ControlGroup>

          <ControlGroup>
            <label>Speed {speed}ms</label>
            <Slider
              type="range"
              min="30"
              max="500"
              step="10"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </ControlGroup>

          <Btn $primary onClick={() => setRunning(!running)}>
            {running ? "⏸ Pause" : "▶ Play"}
          </Btn>
          <Btn onClick={handleReset}>↺ Reset</Btn>
          <Btn onClick={() => {
            setGrid(g => nextGeneration(g, rows, cols));
            setGeneration(gen => gen + 1);
          }}>
            Step →
          </Btn>
        </Controls>

        <CanvasWrapper style={{ maxWidth: "90vw", overflow: "auto" }}>
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={rows * CELL_SIZE}
            onClick={handleCanvasClick}
            style={{
              display: "block",
              maxWidth: "90vw",
              height: "auto",
            }}
          />
        </CanvasWrapper>

        <Stats>
          <div>
            Generation: <span>{generation}</span>
          </div>
          <div>
            Live Cells: <span>{liveCells}</span>
          </div>
          <div>
            Grid: <span>{rows}×{cols}</span>
          </div>
        </Stats>
      </PageWrapper>
    </Layout>
  );
};

export default GameOfLife;
