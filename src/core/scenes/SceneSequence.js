import { Sequence } from '../classes/Sequence.js';

export class SceneSequence {
  constructor(manager) {
    this._seq = new Sequence((scene) => { if (scene) manager.go(scene); });
  }

  run(steps, onComplete) {
    this._seq.run(steps, onComplete);
  }

  cancel() {
    this._seq.cancel();
  }
}
