import { Container, Graphics } from 'pixi.js';

const CARD_R = 6;

export class RadioGroup extends Container {
  constructor({
    items,
    elementsMargin = 8,
    selectedItem = 0,
    values = [],
    onChange,
    itemWidth,
    itemHeight = 48,
    itemOffsetX = 12,
    itemOffsetY = 8,
    cardColor = 0x0d1117,
    cardBorderColor = 0x21262d,
    selectedCardColor = 0x22d3ee,
    selectedCardAlpha = 0.12,
  }) {
    super();
    this._items = items;
    this._values = values;
    this._onChange = onChange;
    this._selectedIndex = selectedItem;

    if (itemWidth) {
      this._itemWidth = itemWidth;
      this._itemHeight = itemHeight;
      this._elementsMargin = elementsMargin;
      this._cardColor = cardColor;
      this._cardBorderColor = cardBorderColor;
      this._selectedCardColor = selectedCardColor;
      this._selectedCardAlpha = selectedCardAlpha;

      this._bgLayer = new Graphics();
      this._bgLayer.eventMode = 'static';
      this._bgLayer.cursor = 'pointer';
      this._bgLayer.on('pointerdown', (e) => {
        const localY = e.getLocalPosition(this._bgLayer).y;
        const idx = Math.floor(localY / (itemHeight + elementsMargin));
        if (idx >= 0 && idx < items.length) this._select(idx);
      });
      this.addChild(this._bgLayer);

      items.forEach((item, i) => {
        item.checked = i === selectedItem;
        item.eventMode = 'none';
        item.x = itemOffsetX;
        item.y = i * (itemHeight + elementsMargin) + itemOffsetY;
        this.addChild(item);
      });

      this._drawCards();
    }
  }

  _select(index) {
    if (index === this._selectedIndex) return;
    this._items[this._selectedIndex].checked = false;
    this._items[index].checked = true;
    this._selectedIndex = index;
    this._drawCards();
    this._onChange?.(index, this._values[index]);
  }

  _drawCards() {
    const g = this._bgLayer;
    g.clear();
    for (let i = 0; i < this._items.length; i++) {
      const y = i * (this._itemHeight + this._elementsMargin);
      const selected = i === this._selectedIndex;
      g.roundRect(0, y, this._itemWidth, this._itemHeight, CARD_R)
        .fill(selected ? { color: this._selectedCardColor, alpha: this._selectedCardAlpha } : { color: this._cardColor, alpha: 1 })
        .stroke({ color: selected ? this._selectedCardColor : this._cardBorderColor, width: 1 });
    }
  }

  getValue() {
    return this._values[this._selectedIndex];
  }

  setEnabled(enabled) {
    if (this._bgLayer) this._bgLayer.eventMode = enabled ? 'static' : 'none';
  }

  get totalHeight() {
    return this._items.length * (this._itemHeight + this._elementsMargin) - this._elementsMargin;
  }
}
