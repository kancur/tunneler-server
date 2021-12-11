module.exports.Player = class Player {
  constructor(number, x, y, dir){
    this.playerNumber = number;
    this.x = x;
    this.y = y;
    this.dir = dir;
  }

  updateState({x, y, dir}) {
    this.x = x;
    this.y = y;
    this.dir = dir;
  }

  getState() {
    return ({
      x: this.x,
      y: this.y,
      dir: this.dir
    })
  }

}