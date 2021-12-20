module.exports.Player = class Player {
  constructor(number, x, y, dir) {
    this.playerNumber = number;
    this.x = x;
    this.y = y;
    this.dir = dir;
    //prettier-ignore
    this.tankUp = [
      0,0,0,1,0,0,0,
      0,1,0,1,0,1,0,
      0,1,1,1,1,1,0,
      0,1,1,1,1,1,0,
      0,1,1,1,1,1,0,
      0,1,1,1,1,1,0,
      0,1,0,0,0,1,0,
    ]
    this.tankDown = this.tankUp.slice().reverse();
    this.tankRight = get90degRotatedOriginalShape(this.tankUp, this.width);
    this.tankLeft = this.tankRight.slice().reverse();
    //prettier-ignore
    this.tankTopRight = [
      0,0,0,1,0,0,0,
      0,0,1,1,0,1,0,
      0,1,1,1,1,0,0,
      1,1,1,1,1,1,1,
      0,0,1,1,1,1,0,
      0,0,0,1,1,0,0,
      0,0,0,1,0,0,0,
    ]
    this.tankBottomRight = get90degRotatedOriginalShape(
      this.tankTopRight,
      this.width
    );
    this.tankBottomLeft = get90degRotatedOriginalShape(
      this.tankBottomRight,
      this.height
    );
    this.tankTopLeft = get90degRotatedOriginalShape(
      this.tankBottomLeft,
      this.height
    );
    this.currentTankShape = this.tankUp;

  }

  updateState({ x, y, dir }) {
    this.x = x;
    this.y = y;
    this.dir = dir;
  }

  getState() {
    return {
      x: this.x,
      y: this.y,
      dir: this.dir,
    };
  }

  moveByVector(vector2) {
    if (this.readyToMove) {
      if (
        this.isLegalMove(
          this.x + vector2.x * this.movementSpeed,
          this.y + vector2.y * this.movementSpeed,
          this.currentTankShape
        )
      ) {
        this.x += vector2.x * this.movementSpeed;
        this.y += vector2.y * this.movementSpeed;
      }
    }
  }




};

function get90degRotatedOriginalShape(matrix, width) {
  const rotatedTank = [];
  for (let x = 0; x < width; x++) {
    for (let y = matrix.length / width - 1; y >= 0; y--) {
      rotatedTank.push(matrix[[y * width + x]]);
    }
  }
  return rotatedTank;
}
