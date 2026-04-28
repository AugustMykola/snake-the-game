import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { COLS, ROWS, CELL } from '../../shared/constants/constants.js';
import { THEME, FONT } from '../scenes/theme.js';

export class GameRenderer extends Container {
  constructor() {
    super();

    this._bgLayer = new Container();
    this._wallLayer = new Graphics();
    this._foodLayer = new Graphics();
    this._snakeLayer = new Graphics();
    this._overlayLayer = new Container();

    this.addChild(this._bgLayer);
    this.addChild(this._wallLayer);
    this.addChild(this._foodLayer);
    this.addChild(this._snakeLayer);
    this.addChild(this._overlayLayer);

    this._drawGrid();
  }

  _drawGrid() {
    const g = new Graphics();
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const fill = (col + row) % 2 === 0 ? THEME.gridA : THEME.gridB;
        g.rect(col * CELL, row * CELL, CELL, CELL).fill(fill);
      }
    }
    for (let row = 0; row <= ROWS; row++) {
      g.rect(0, row * CELL - 0.5, COLS * CELL, 1).fill({ color: 0x000000, alpha: 0.18 });
    }
    this._bgLayer.addChild(g);
  }

  _cell(g, x, y, color, radius = 3, glowAlphas = []) {
    const px = x * CELL + 1;
    const py = y * CELL + 1;
    const sz = CELL - 2;
    for (let i = glowAlphas.length - 1; i >= 0; i--) {
      const expand = (i + 1) * 2;
      g.roundRect(px - expand / 2, py - expand / 2, sz + expand, sz + expand, radius + 2).fill({
        color,
        alpha: glowAlphas[i],
      });
    }
    g.roundRect(px, py, sz, sz, radius).fill(color);
  }

  render(engine) {
    this._renderWalls(engine);
    this._renderFood(engine);
    this._renderSnake(engine);
  }

  _renderWalls(engine) {
    this._wallLayer.clear();
    for (const w of engine.walls) {
      this._cell(this._wallLayer, w.x, w.y, THEME.wall, 2, [0.06, 0.14]);
      const px = w.x * CELL + 1;
      const py = w.y * CELL + 1;
      const sz = CELL - 2;
      this._wallLayer.roundRect(px, py, sz, sz, 2).stroke({ color: THEME.wallBorder, width: 1 });
    }
  }

  _renderFood(engine) {
    this._foodLayer.clear();
    engine.foods.forEach((food, idx) => {
      const color = idx === 0 ? THEME.foodA : THEME.foodB;
      const fx = food.x * CELL + CELL / 2;
      const fy = food.y * CELL + CELL / 2;
      const r = CELL / 2 - 3;
      this._foodLayer.circle(fx, fy, r + 7).fill({ color, alpha: 0.05 });
      this._foodLayer.circle(fx, fy, r + 4).fill({ color, alpha: 0.12 });
      this._foodLayer.circle(fx, fy, r + 1).fill({ color, alpha: 0.3 });
      this._foodLayer.circle(fx, fy, r).fill(color);
    });
  }

  _renderSnake(engine) {
    this._snakeLayer.clear();
    const body = engine.snake.body;
    for (let i = body.length - 1; i >= 0; i--) {
      const seg = body[i];
      if (seg.x < 0 || seg.x >= COLS || seg.y < 0 || seg.y >= ROWS) continue;

      if (i === 0) {
        this._cell(this._snakeLayer, seg.x, seg.y, THEME.cyan, 5, [0.04, 0.1, 0.2]);
      } else {
        const t = i / body.length;
        const color = t < 0.45 ? THEME.cyanMid : THEME.cyanDark;
        this._cell(this._snakeLayer, seg.x, seg.y, color, 3);
      }
    }
  }

  showOverlay(message) {
    this._overlayLayer.removeChildren();

    const g = new Graphics();
    g.rect(0, 0, COLS * CELL, ROWS * CELL).fill({ color: 0x000000, alpha: 0.75 });
    g.rect(0, 0, COLS * CELL, ROWS * CELL).fill({ color: THEME.cyan, alpha: 0.04 });
    this._overlayLayer.addChild(g);

    const bw = 260,
      bh = 72;
    const bx = (COLS * CELL - bw) / 2;
    const by = (ROWS * CELL - bh) / 2;
    const box = new Graphics();
    box.roundRect(bx - 2, by - 2, bw + 4, bh + 4, 6).fill({ color: THEME.cyan, alpha: 0.12 });
    box.roundRect(bx, by, bw, bh, 5).fill({ color: 0x030408, alpha: 0.95 });
    box.roundRect(bx, by, bw, bh, 5).stroke({ color: THEME.cyan, alpha: 0.5, width: 1 });
    this._overlayLayer.addChild(box);

    const t = new Text({
      text: message,
      style: new TextStyle({
        fontFamily: FONT.ui,
        fontSize: 26,
        fontWeight: '700',
        fill: THEME.cyan,
        align: 'center',
        dropShadow: { color: THEME.cyan, distance: 0, blur: 12, alpha: 0.8 },
      }),
    });
    t.anchor.set(0.5, 0.5);
    t.x = (COLS * CELL) / 2;
    t.y = (ROWS * CELL) / 2;
    this._overlayLayer.addChild(t);
  }

  clearOverlay() {
    this._overlayLayer.removeChildren();
  }
}
