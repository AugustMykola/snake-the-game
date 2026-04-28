import { Container, Graphics } from 'pixi.js';
import { THEME } from '../scenes/theme.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../shared/constants/constants.js';

export class MenuBackground extends Container {
  constructor({ panelX, panelW }) {
    super();

    const bg = new Graphics();
    bg.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).fill(THEME.bg);
    this.addChild(bg);

    const panel = new Graphics();
    panel
      .roundRect(panelX, 10, panelW, CANVAS_HEIGHT - 20, 10)
      .fill(THEME.panel)
      .stroke({ color: THEME.panelBorder, width: 1 });
    this.addChild(panel);
  }
}
