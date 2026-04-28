export const DIR = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export function oppositeDir(a, b) {
  return a.x === -b.x && a.y === -b.y;
}

export function randomCell(cols, rows, exclude = []) {
  const excludeSet = new Set(exclude.map((p) => `${p.x},${p.y}`));
  let pos;
  let attempts = 0;
  do {
    pos = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    attempts++;
    if (attempts > cols * rows * 2) return null;
  } while (excludeSet.has(`${pos.x},${pos.y}`));
  return pos;
}
