export class Sequence {
  _gen = 0;

  constructor(onStep) {
    if (onStep) this.onStep = onStep;
  }

  run(steps, onComplete) {
    const gen = ++this._gen;
    let i = 0;

    const advance = (payload) => {
      if (gen !== this._gen) return;
      if (i >= steps.length) {
        onComplete?.();
        return;
      }
      const result = steps[i++](advance, payload);
      this.onStep(result);
    };

    advance();
  }

  cancel() {
    ++this._gen;
  }

  onStep(_result) {}
}
