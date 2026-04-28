import { Ticker } from 'pixi.js';
import { GAME_STATE } from '../engine/GameEngine.js';

export class TickLoop {
  _ticker = null;
  _engine = null;
  _onTick = null;
  _elapsed = 0;

  _update = (ticker) => {
    if (!this._engine || !this._onTick) return;
    this._elapsed += ticker.deltaMS;
    if (this._elapsed < this._engine.interval) return;
    this._elapsed = 0;
    const event = this._engine.tick();
    this._onTick(event);
    if (this._engine.state === GAME_STATE.GAME_OVER) {
      this.stop();
    }
  };

  start(engine, ticker, onTick) {
    this.stop();
    this._engine = engine;
    this._onTick = onTick;
    this._elapsed = 0;
    this._ticker = ticker;
    ticker.add(this._update);
  }

  stop() {
    if (this._ticker) {
      this._ticker.remove(this._update);
      this._ticker = null;
    }
    this._engine = null;
    this._onTick = null;
    this._elapsed = 0;
  }
}
