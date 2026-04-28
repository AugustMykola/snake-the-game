import { Application } from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './shared/constants/constants.js';
import { GameEngine, GAME_STATE } from './core/engine/GameEngine.js';
import { SceneManager } from './core/scenes/SceneManager.js';
import { SceneSequence } from './core/scenes/SceneSequence.js';
import { BestScoreStore } from './core/services/BestScoreStore.js';
import { InputController } from './core/services/InputController.js';
import { TickLoop } from './core/services/TickLoop.js';
import { MenuScene } from './components/scenes/MenuScene.js';
import { GameScene } from './components/scenes/GameScene.js';
import { THEME } from './components/scenes/theme.js';

function fitCanvas(canvas) {
  const s = Math.min(window.innerWidth / CANVAS_WIDTH, window.innerHeight / CANVAS_HEIGHT);
  canvas.style.width = `${CANVAS_WIDTH * s}px`;
  canvas.style.height = `${CANVAS_HEIGHT * s}px`;
}

class Game {
  async init() {
    const canvas = document.getElementById('game-canvas');

    this.pixiApp = new Application();
    await this.pixiApp.init({
      canvas,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: THEME.bg,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    fitCanvas(canvas);
    window.addEventListener('resize', () => fitCanvas(canvas));

    this._score = new BestScoreStore();
    this._input = new InputController();
    this._loop = new TickLoop();

    this.scenes = new SceneManager(this.pixiApp);
    this.flow = new SceneSequence(this.scenes);

    this._runFlow();
  }

  _runFlow() {
    this.flow.run(
      [
        (dispatch) =>
          new MenuScene({
            bestScore: this._score.value,
            onPlay: (mode) => dispatch(mode),
          }),

        (dispatch, payload) => {
          this._loop.stop();
          this._input.detach();

          const mode = payload;
          const engine = new GameEngine(20, 20, mode);
          const scene = new GameScene({
            mode,
            bestScore: this._score.value,
            onMenu: () => {
              this._loop.stop();
              this._input.detach();
              dispatch();
            },
            onExit: () => {
              this._loop.stop();
              scene.renderer.showOverlay('Game Over');
              dispatch();
            },
          });

          this._input.attach(engine);
          this._loop.start(engine, this.pixiApp.ticker, (event) => {
            if (event === 'ate') {
              scene.hud.setCurrentScore(engine.score);
              if (this._score.update(engine.score)) {
                scene.hud.setBestScore(this._score.value);
              }
            }
            scene.renderer.render(engine);
            if (engine.state === GAME_STATE.GAME_OVER) {
              scene.renderer.showOverlay('Game Over!');
            }
          });

          return scene;
        },
      ],
      () => this._runFlow(),
    );
  }
}

const game = new Game();
game.init();
