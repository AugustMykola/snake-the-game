import { Container, Graphics } from 'pixi.js';
import { Application, Ticker } from 'pixi.js';
import { Scene } from '../classes/Scene.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../shared/constants/constants.js';

const FADE_MS = 200;

export class SceneManager {
  constructor(app) {
    this._stage = app.stage;
    this._ticker = app.ticker;

    this._overlay = new Graphics();
    this._overlay.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).fill(0x000000);
    this._overlay.alpha = 0;
    this._overlay.eventMode = 'none';
    this._overlay.zIndex = 9999;

    this._current = null;
    this._queue = [];
    this._busy = false;
  }

  go(next) {
    if (this._busy) {
      this._queue = [next];
      return;
    }
    this._transition(next);
  }

  _transition(next) {
    this._busy = true;

    const prev = this._current;
    this._current = next;

    const finish = () => {
      this._busy = false;
      if (this._queue.length > 0) {
        this._transition(this._queue.shift());
      }
    };

    if (!prev) {
      this._stage.addChild(next);
      next.onEnter();
      this._pushOverlay();
      this._fade(1, 0, () => {
        this._popOverlay();
        finish();
      });
      return;
    }

    this._pushOverlay();
    this._fade(0, 1, () => {
      prev.onExit();
      this._stage.removeChild(prev);
      this._stage.addChild(next);
      next.onEnter();
      this._pushOverlay();
      this._fade(1, 0, () => {
        this._popOverlay();
        finish();
      });
    });
  }

  _pushOverlay() {
    if (this._overlay.parent) this._stage.removeChild(this._overlay);
    this._stage.addChild(this._overlay);
  }

  _popOverlay() {
    if (this._overlay.parent) this._stage.removeChild(this._overlay);
  }

  _fade(from, to, onDone) {
    this._overlay.alpha = from;
    const start = performance.now();

    const tick = () => {
      const t = Math.min((performance.now() - start) / FADE_MS, 1);
      this._overlay.alpha = from + (to - from) * t;
      if (t >= 1) {
        this._ticker.remove(tick);
        onDone();
      }
    };

    this._ticker.add(tick);
  }
}
