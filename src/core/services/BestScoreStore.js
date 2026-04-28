const KEY = 'snake_best_score';

export class BestScoreStore {
  constructor() {
    this._value = parseInt(localStorage.getItem(KEY) ?? '0', 10);
  }

  get value() {
    return this._value;
  }

  update(n) {
    if (n <= this._value) return false;
    this._value = n;
    localStorage.setItem(KEY, String(n));
    return true;
  }
}
