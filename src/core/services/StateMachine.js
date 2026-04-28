export class StateMachine {
  _current = null;

  transition(next) {
    this._current?.exit();
    this._current = next;
    this._current.enter();
  }

  get current() {
    return this._current;
  }
}
