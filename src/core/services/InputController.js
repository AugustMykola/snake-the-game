import { GameEngine, GAME_STATE } from '../engine/GameEngine.js';
import { DIR } from '../../helpers/utils.js';

export class InputController {
  _engine = null;

  constructor() {
    document.addEventListener('keydown', (e) => {
      if (!this._engine || this._engine.state !== GAME_STATE.PLAYING) return;
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          this._engine.setDirection(DIR.UP);
          break;
        case 'ArrowDown':
          e.preventDefault();
          this._engine.setDirection(DIR.DOWN);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this._engine.setDirection(DIR.LEFT);
          break;
        case 'ArrowRight':
          e.preventDefault();
          this._engine.setDirection(DIR.RIGHT);
          break;
      }
    });
  }

  attach(engine) {
    this._engine = engine;
  }

  detach() {
    this._engine = null;
  }
}
