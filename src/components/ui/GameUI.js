import { Container, Graphics } from 'pixi.js';
import { ScoreLabel } from './ScoreLabel.js';
import { Button } from './Button.js';
import { THEME } from '../scenes/theme.js';
import { CANVAS_HEIGHT, UI_WIDTH } from '../../shared/constants/constants.js';

export class GameUI extends Container {
  constructor({ onMenu, onExit }) {
    super();

    const W = UI_WIDTH;

    const bg = new Graphics();
    bg.rect(0, 0, W, CANVAS_HEIGHT).fill(THEME.panel);
    bg.rect(0, 0, 1, CANVAS_HEIGHT).fill(THEME.panelBorder);
    this.addChild(bg);

    let y = 24;

    this._currentLbl = new ScoreLabel({ title: 'SCORE', width: W - 40, height: 52 });
    this._currentLbl.x = 20;
    this._currentLbl.y = y;
    this.addChild(this._currentLbl);
    y += 52 + 12;

    this._bestLbl = new ScoreLabel({ title: 'BEST', width: W - 40, height: 52 });
    this._bestLbl.x = 20;
    this._bestLbl.y = y;
    this.addChild(this._bestLbl);

    const btnMenu = new Button({
      label: 'MENU',
      width: W - 40,
      height: 40,
      variant: 'secondary',
      onClick: onMenu,
    });
    btnMenu.x = 20;
    btnMenu.y = CANVAS_HEIGHT - 100;
    this.addChild(btnMenu);

    const btnExit = new Button({
      label: 'EXIT',
      width: W - 40,
      height: 40,
      variant: 'danger',
      onClick: onExit,
    });
    btnExit.x = 20;
    btnExit.y = CANVAS_HEIGHT - 50;
    this.addChild(btnExit);
  }

  setCurrentScore(n) {
    this._currentLbl.setValue(n);
  }

  setBestScore(n) {
    this._bestLbl.setValue(n);
  }
}
