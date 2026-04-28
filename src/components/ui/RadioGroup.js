import { Container } from 'pixi.js';
import { CheckBox, RadioGroup as PixiRadioGroup } from '@pixi/ui';

export class RadioGroup extends Container {
  constructor({ items, type = 'vertical', elementsMargin = 2, selectedItem = 0, values = [], onChange }) {
    super();

    this._items = items;
    this._values = values;
    this._inner = new PixiRadioGroup({ items, type, elementsMargin, selectedItem });
    this.addChild(this._inner);

    if (onChange) {
      this._inner.onChange.connect((id, labelVal) => onChange(id, this._values[id] ?? labelVal));
    }
  }

  getValue() {
    const id = this._inner.selected;
    return this._values[id] ?? this._inner.value;
  }

  setEnabled(enabled) {
    for (const item of this._items) {
      item.innerView.eventMode = enabled ? 'static' : 'none';
    }
  }

  get totalHeight() {
    return this._inner.innerView?.height ?? 0;
  }
}
