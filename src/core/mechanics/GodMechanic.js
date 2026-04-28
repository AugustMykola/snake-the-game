export class GodMechanic {
  passThrough = true;
  selfDeath = false;
  boundaryDeath = false;
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
