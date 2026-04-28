import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { FONT } from '../scenes/theme.js';

export class ScoreLabel extends Container {
  constructor({ title, width = 208, height = 58 }) {
    super();

    const bg = new Graphics();
    bg.roundRect(0, 0, width, height, 8).fill(0x0d1117);
    bg.roundRect(0, 0, width, height, 8).stroke({ color: 0x21262d, width: 1 });
    this.addChild(bg);

    const titleTxt = new Text({
      text: title,
      style: new TextStyle({
        fontFamily: FONT.ui,
        fontSize: FONT.sizeXs,
        fill: 0x888888,
        letterSpacing: 1,
      }),
    });
    titleTxt.x = 12;
    titleTxt.y = 10;
    this.addChild(titleTxt);

    this._valueTxt = new Text({
      text: '0',
      style: new TextStyle({
        fontFamily: FONT.ui,
        fontSize: FONT.sizeXl,
        fontWeight: FONT.weightBold,
        fill: 0x4ade80,
      }),
    });
    this._valueTxt.x = 12;
    this._valueTxt.y = 22;
    this.addChild(this._valueTxt);
  }

  setValue(v) {
    this._valueTxt.text = String(v);
  }
}
