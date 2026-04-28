import { DIR, oppositeDir } from '../../helpers/utils.js';

export class Snake {
  constructor(startX, startY) {
    this.body = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
    ];
    this.direction = DIR.RIGHT;
    this.nextDirection = DIR.RIGHT;
    this.grew = false;
  }

  get head() {
    return this.body[0];
  }

  setDirection(dir) {
    if (!oppositeDir(dir, this.direction)) {
      this.nextDirection = dir;
    }
  }

  move(cols, rows, passThrough) {
    this.direction = this.nextDirection;
    const head = this.head;
    let nx = head.x + this.direction.x;
    let ny = head.y + this.direction.y;

    if (passThrough) {
      nx = (nx + cols) % cols;
      ny = (ny + rows) % rows;
    }

    this.body.unshift({ x: nx, y: ny });

    if (this.grew) {
      this.grew = false;
    } else {
      this.body.pop();
    }
  }

  grow() {
    this.grew = true;
  }

  occupies(x, y, skipHead = false) {
    const start = skipHead ? 1 : 0;
    for (let i = start; i < this.body.length; i++) {
      if (this.body[i].x === x && this.body[i].y === y) return true;
    }
    return false;
  }
}
