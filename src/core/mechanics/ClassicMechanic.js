export class ClassicMechanic {
  passThrough = false;
  selfDeath = true;
  boundaryDeath = true;
  wallDeath = false;

  getFoodEatenSteps(board, foodIndex) {
    return [
      (dispatch) => {
        board.snake.grow();
        dispatch();
      },
      (dispatch) => {
        board.foods.splice(foodIndex, 1);
        board.spawnFood();
        dispatch();
      },
    ];
  }
}
