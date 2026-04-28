export class PortalMechanic {
  passThrough = true;
  selfDeath = false;
  boundaryDeath = false;
  wallDeath = false;

  getFoodEatenSteps(board, foodIndex) {
    return [
      (dispatch) => {
        const other = board.foods[1 - foodIndex];
        if (other) {
          board.snake.body[0] = { x: other.x, y: other.y };
          board.snake.grow();
          board.foods.splice(foodIndex, 1);
        }
        dispatch();
      },
      (dispatch) => {
        board.spawnFood();
        dispatch();
      },
    ];
  }
}
