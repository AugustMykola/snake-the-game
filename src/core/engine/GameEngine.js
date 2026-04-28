import { randomCell } from '../../helpers/utils.js';
import { Food } from '../classes/Food.js';
import { StateMachine } from '../services/StateMachine.js';
import { Snake } from '../classes/Snake.js';
import { Sequence } from '../classes/Sequence.js';
import { ClassicMechanic } from '../mechanics/ClassicMechanic.js';
import { GodMechanic } from '../mechanics/GodMechanic.js';
import { WallsMechanic } from '../mechanics/WallsMechanic.js';
import { PortalMechanic } from '../mechanics/PortalMechanic.js';
import { SpeedMechanic } from '../mechanics/SpeedMechanic.js';

export const GAME_STATE = {
  PLAYING: 'playing',
  GAME_OVER: 'gameover',
};

export const GAME_MODE = {
  CLASSIC: 'classic',
  GOD: 'god',
  WALLS: 'walls',
  PORTAL: 'portal',
  SPEED: 'speed',
};

class BoardContext {
  cols;
  rows;
  baseInterval = 180;
  score = 0;
  interval = 180;
  snake;
  walls = [];
  foods = [];

  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    const midX = Math.floor(cols / 2);
    const midY = Math.floor(rows / 2);
    this.snake = new Snake(midX, midY);
  }

  spawnFood() {
    const pos = randomCell(this.cols, this.rows, [
      ...this.snake.body,
      ...this.walls,
      ...this.foods,
    ]);
    if (pos) this.foods.push(new Food(pos.x, pos.y));
  }

  spawnWall() {
    const pos = randomCell(this.cols, this.rows, [
      ...this.snake.body,
      ...this.walls,
      ...this.foods,
    ]);
    if (pos) this.walls.push(pos);
  }
}

class PlayingEngineState {
  stateId = GAME_STATE.PLAYING;
  _seq = new Sequence();

  constructor(board, mechanic, onGameOver) {
    this._board = board;
    this._mechanic = mechanic;
    this._onGameOver = onGameOver;
  }

  enter() {}
  exit() {}

  tick() {
    const board = this._board;
    const mech = this._mechanic;

    board.snake.move(board.cols, board.rows, mech.passThrough);
    const { x, y } = board.snake.head;

    if (mech.boundaryDeath && (x < 0 || x >= board.cols || y < 0 || y >= board.rows)) {
      this._onGameOver();
      return 'gameover';
    }

    if (mech.selfDeath) {
      for (let i = 1; i < board.snake.body.length; i++) {
        if (board.snake.body[i].x === x && board.snake.body[i].y === y) {
          this._onGameOver();
          return 'gameover';
        }
      }
    }

    if (mech.wallDeath) {
      for (const w of board.walls) {
        if (w.x === x && w.y === y) {
          this._onGameOver();
          return 'gameover';
        }
      }
    }

    for (let i = 0; i < board.foods.length; i++) {
      if (board.foods[i].occupies(x, y)) {
        board.score++;
        this._seq.run(mech.getFoodEatenSteps(board, i));
        return 'ate';
      }
    }

    return 'moved';
  }
}

class GameOverEngineState {
  stateId = GAME_STATE.GAME_OVER;
  enter() {}
  exit() {}
  tick() {
    return null;
  }
}

function createMechanic(mode) {
  switch (mode) {
    case GAME_MODE.CLASSIC:
      return new ClassicMechanic();
    case GAME_MODE.GOD:
      return new GodMechanic();
    case GAME_MODE.WALLS:
      return new WallsMechanic();
    case GAME_MODE.PORTAL:
      return new PortalMechanic();
    case GAME_MODE.SPEED:
      return new SpeedMechanic();
  }
}

export class GameEngine {
  constructor(cols, rows, mode) {
    this.cols = cols;
    this.rows = rows;
    this.mode = mode;

    this._board = new BoardContext(cols, rows);
    this._mechanic = createMechanic(mode);
    this._sm = new StateMachine();

    const playing = new PlayingEngineState(this._board, this._mechanic, () => {
      this._sm.transition(new GameOverEngineState());
    });

    this._sm.transition(playing);
    this._board.spawnFood();

    if (mode === GAME_MODE.PORTAL) {
      this._board.spawnFood();
    }
  }

  get state() {
    return this._sm.current?.stateId ?? GAME_STATE.GAME_OVER;
  }

  get snake() {
    return this._board.snake;
  }

  get foods() {
    return this._board.foods;
  }

  get walls() {
    return this._board.walls;
  }

  get score() {
    return this._board.score;
  }

  get interval() {
    return this._board.interval;
  }

  setDirection(dir) {
    this._board.snake.setDirection(dir);
  }

  tick() {
    return this._sm.current?.tick() ?? null;
  }
}
