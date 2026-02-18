// Shared Game of Life logic

export const PRESETS = {
  empty: { name: "Empty Grid", cells: [] },
  glider: { name: "Glider", cells: [[1,0],[2,1],[0,2],[1,2],[2,2]] },
  blinker: { name: "Blinker", cells: [[1,0],[1,1],[1,2]] },
  toad: { name: "Toad", cells: [[1,1],[2,1],[3,1],[0,2],[1,2],[2,2]] },
  beacon: { name: "Beacon", cells: [[0,0],[1,0],[0,1],[3,2],[2,3],[3,3]] },
  pulsar: {
    name: "Pulsar",
    cells: [
      [2,0],[3,0],[4,0],[8,0],[9,0],[10,0],
      [0,2],[5,2],[7,2],[12,2],[0,3],[5,3],[7,3],[12,3],
      [0,4],[5,4],[7,4],[12,4],
      [2,5],[3,5],[4,5],[8,5],[9,5],[10,5],
      [2,7],[3,7],[4,7],[8,7],[9,7],[10,7],
      [0,8],[5,8],[7,8],[12,8],[0,9],[5,9],[7,9],[12,9],
      [0,10],[5,10],[7,10],[12,10],
      [2,12],[3,12],[4,12],[8,12],[9,12],[10,12],
    ],
  },
  gliderGun: {
    name: "Gosper Glider Gun",
    cells: [
      [24,0],[22,1],[24,1],
      [12,2],[13,2],[20,2],[21,2],[34,2],[35,2],
      [11,3],[15,3],[20,3],[21,3],[34,3],[35,3],
      [0,4],[1,4],[10,4],[16,4],[20,4],[21,4],
      [0,5],[1,5],[10,5],[14,5],[16,5],[17,5],[22,5],[24,5],
      [10,6],[16,6],[24,6],[11,7],[15,7],[12,8],[13,8],
    ],
  },
  random: { name: "Random (25%)", cells: "random" },
};

export const createEmptyGrid = (rows, cols) =>
  Array.from({ length: rows }, () => new Uint8Array(cols));

export const placePreset = (grid, preset, rows, cols) => {
  if (preset === "random") {
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        grid[r][c] = Math.random() < 0.25 ? 1 : 0;
    return;
  }
  const cells = PRESETS[preset]?.cells || [];
  if (typeof cells === "string" || !cells.length) return;
  const maxR = Math.max(...cells.map(c => c[1]));
  const maxC = Math.max(...cells.map(c => c[0]));
  const offsetR = Math.floor(rows / 2) - Math.floor((maxR + 1) / 2);
  const offsetC = Math.floor(cols / 2) - Math.floor((maxC + 1) / 2);
  cells.forEach(([c, r]) => {
    const nr = r + offsetR, nc = c + offsetC;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) grid[nr][nc] = 1;
  });
};

export const nextGeneration = (grid, rows, cols) => {
  const next = createEmptyGrid(rows, cols);
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      let n = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) n += grid[nr][nc];
        }
      next[r][c] = grid[r][c] ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
    }
  return next;
};

export const countLiveCells = (grid) =>
  grid.reduce((s, row) => s + row.reduce((a, c) => a + c, 0), 0);

export const gridsEqual = (a, b, rows, cols) => {
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (a[r][c] !== b[r][c]) return false;
  return true;
};

export const gridHash = (grid, rows, cols) => {
  // Simple hash for cycle detection (check last few states)
  let h = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (grid[r][c]) h = (h * 31 + r * cols + c) | 0;
  return h;
};
