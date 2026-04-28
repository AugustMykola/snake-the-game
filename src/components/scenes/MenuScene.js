import { Text, TextStyle, Graphics } from 'pixi.js';
import { CheckBox } from '@pixi/ui';
import { Scene } from '../../core/classes/Scene.js';
import { GAME_MODE } from '../../core/engine/GameEngine.js';
import { ScoreLabel } from '../ui/ScoreLabel.js';
import { Button } from '../ui/Button.js';
import { RadioGroup } from '../ui/RadioGroup.js';
import { MenuBackground } from '../ui/MenuBackground.js';
import { CANVAS_WIDTH } from '../../shared/constants/constants.js';
import { THEME, FONT } from './theme.js';

const MODES = [
  { value: GAME_MODE.CLASSIC, label: 'Classic', desc: 'Die on walls & self' },
  { value: GAME_MODE.GOD, label: 'God Mode', desc: 'Pass through walls & self' },
  { value: GAME_MODE.WALLS, label: 'Walls', desc: 'Food spawns a wall cell' },
  { value: GAME_MODE.PORTAL, label: 'Portal', desc: 'Two foods — eat to teleport' },
  { value: GAME_MODE.SPEED, label: 'Speed', desc: '+10% speed per food' },
];

export class MenuScene extends Scene {
  constructor({ bestScore, onPlay }) {
    super();
    this._bestScore = bestScore;
    this._onPlay = onPlay;
    this._build();
  }

  setBestScore(v) {
    this._bestScore = v;
    this._bestLbl.setValue(v);
  }

  _build() {
    const PANEL_W = 360;
    const PANEL_X = Math.floor((CANVAS_WIDTH - PANEL_W) / 2);
    const PAD = 20;
    const INNER = PANEL_W - PAD * 2;

    this.addChild(new MenuBackground({ panelX: PANEL_X, panelW: PANEL_W }));

    let y = PAD + 8;

    const titleTxt = new Text({
      text: '> SNAKE.EXE',
      style: new TextStyle({
        fontFamily: FONT.numbers,
        fontSize: 32,
        fontWeight: '700',
        fill: THEME.cyan,
        dropShadow: { color: THEME.cyan, distance: 0, blur: 16, alpha: 0.8 },
      }),
    });
    titleTxt.x = PANEL_X + (PANEL_W - titleTxt.width) / 2;
    titleTxt.y = y;
    this.addChild(titleTxt);
    y += titleTxt.height + 4;

    const subTxt = new Text({
      text: '[ USE ARROW KEYS TO MOVE ]',
      style: new TextStyle({
        fontFamily: FONT.ui,
        fontSize: 9,
        fill: THEME.textMuted,
        letterSpacing: 0.8,
      }),
    });
    subTxt.x = PANEL_X + (PANEL_W - subTxt.width) / 2;
    subTxt.y = y;
    this.addChild(subTxt);
    y += subTxt.height + 14;

    this._bestLbl = new ScoreLabel({ title: 'BEST SCORE', width: INNER, height: 52 });
    this._bestLbl.x = PANEL_X + PAD;
    this._bestLbl.y = y;
    this._bestLbl.setValue(this._bestScore);
    this.addChild(this._bestLbl);
    y += 52 + 10;

    this._hline(PANEL_X + PAD, y, INNER);
    y += 10;

    const makeRadioG = (selected) => {
      const g = new Graphics();
      g.circle(10, 10, 10).stroke({ color: THEME.cyan, width: 2 });
      if (selected) g.circle(10, 10, 5).fill({ color: THEME.cyan });
      return g;
    };

    const checkboxItems = MODES.map((mode) => {
      const cb = new CheckBox({
        style: {
          unchecked: makeRadioG(false),
          checked: makeRadioG(true),
          text: { fontFamily: FONT.ui, fontSize: 13, fill: THEME.textPrimary },
          textOffset: { x: 8 },
        },
        text: mode.label,
      });
      const descText = new Text({
        text: mode.desc,
        style: new TextStyle({ fontFamily: FONT.ui, fontSize: 9, fill: THEME.textDim }),
      });
      descText.x = 28;
      descText.y = 20;
      cb.addChild(descText);
      return cb;
    });

    this._modeSelector = new RadioGroup({
      items: checkboxItems,
      values: MODES.map(m => m.value),
      selectedItem: 0,
      elementsMargin: 14,
    });
    this._modeSelector.x = PANEL_X + PAD;
    this._modeSelector.y = y;
    this.addChild(this._modeSelector);
    y += this._modeSelector.totalHeight + 10;

    this._hline(PANEL_X + PAD, y, INNER);
    y += 10;

    const btnPlay = new Button({
      label: 'PLAY',
      width: INNER,
      height: 44,
      variant: 'primary',
      onClick: () => this._onPlay(this._modeSelector.getValue()),
    });
    btnPlay.x = PANEL_X + PAD;
    btnPlay.y = y;
    this.addChild(btnPlay);
  }

  _hline(x, y, w) {
    const line = new Graphics();
    line.rect(x, y, w, 1).fill({ color: THEME.cyan, alpha: 0.12 });
    this.addChild(line);
  }
}
