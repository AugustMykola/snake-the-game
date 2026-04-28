import { Graphics } from 'pixi.js';

export function makeBg(color, w, h) {
  return new Graphics().roundRect(0, 0, w, h, 6).fill(color);
}
