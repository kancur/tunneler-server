const { nanoid } = require('nanoid');
const { randomInt } = require('./Helpers');
const { Player } = require('./Player');

class Game {
  constructor() {
    this.code = nanoid(5);
    this.seed = Math.floor(Math.random() * 1000000);
    this.width = 1200
    this.height = 600
    this.players = {};
  }

  addPlayer(number){
    // const x = randomInt(70, this.width - 1000);
    // const y = randomInt(70, this.height - 500);
    const x = randomInt(70, this.width - 140);
    const y = randomInt(70, this.height - 140);
    this.players[number] = new Player(number, x, y, 'up')
  }

  updatePlayer(number, data){
    this.players[number].update(data)
  }

  getState(){
    let state = {}
    Object.keys(this.players).forEach(key => {
      const player = this.players[key]
      state[key] = player.getState()
    })
    return state
  }

}

module.exports = Game;