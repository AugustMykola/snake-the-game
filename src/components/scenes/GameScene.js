import { Scene } from '../../core/classes/Scene.js';
import { GameRenderer } from '../renderer/Renderer.js';
import { GameUI } from '../ui/GameUI.js';
import { GAME_WIDTH } from '../../shared/constants/constants.js';

export class GameScene extends Scene {
  constructor({ mode, bestScore, onMenu, onExit }) {
    super();
    this.mode = mode;

    this.renderer = new GameRenderer();
    this.addChild(this.renderer);

    this.hud = new GameUI({ onMenu, onExit });
    this.hud.x = GAME_WIDTH;
    this.addChild(this.hud);

    this.hud.setBestScore(bestScore);
    this.hud.setCurrentScore(0);
  }

  onEnter() {
    this.renderer.clearOverlay();
  }
}
