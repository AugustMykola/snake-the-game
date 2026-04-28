export class SpeedMechanic {
  passThrough = false;
  selfDeath = true;
  boundaryDeath = true;
  wallDeath = false;

  _speedFactor = 1.0;

  getFoodEatenSteps(board, foodIndex) {
    return [
      (dispatch) => {
        board.snake.grow();
        dispatch();
      },
      (dispatch) => {
        board.foods.splice(foodIndex, 1);
        dispatch();
      },
      (dispatch) => {
        this._speedFactor *= 0.9;
        board.interval = Math.max(40, Math.round(board.baseInterval * this._speedFactor));
        board.spawnFood();
        dispatch();
      },
    ];
  }
}
