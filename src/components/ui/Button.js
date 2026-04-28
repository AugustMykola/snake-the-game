import { Text, TextStyle } from 'pixi.js';
import { FancyButton } from '@pixi/ui';
import { makeBg } from '../../helpers/make-bg.helper.js';
import { FONT } from '../scenes/theme.js';

const VARIANTS = {
  primary: { bg: 0x4ade80, hover: 0x6ee7a0, pressed: 0x22c55e, text: 0x0f1f0f },
  secondary: { bg: 0x3b82f6, hover: 0x60a5fa, pressed: 0x2563eb, text: 0xffffff },
  danger: { bg: 0xef4444, hover: 0xf87171, pressed: 0xdc2626, text: 0xffffff },
};

export class Button extends FancyButton {
  constructor({ label, width = 100, height = 40, variant = 'primary', onClick }) {
    const v = VARIANTS[variant];
    super({
      defaultView: makeBg(v.bg, width, height),
      hoverView: makeBg(v.hover, width, height),
      pressedView: makeBg(v.pressed, width, height),
      disabledView: makeBg(v.bg, width, height),
      text: new Text({
        text: label,
        style: new TextStyle({
          fontFamily: FONT.ui,
          fontSize: FONT.sizeMd,
          fontWeight: FONT.weightSemibold,
          fill: v.text,
        }),
      }),
    });

    if (onClick) this.onPress.connect(onClick);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}
