export class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  occupies(x, y) {
    return this.x === x && this.y === y;
  }
}
