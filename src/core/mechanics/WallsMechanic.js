export class WallsMechanic {
  passThrough = false;
  selfDeath = true;
  boundaryDeath = true;
  wallDeath = true;

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
        board.spawnWall();
        board.spawnFood();
        dispatch();
      },
    ];
  }
}
