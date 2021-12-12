const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Game = require("./Game");

const app = express();
const httpServer = createServer(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const UPDATE_RATE = 18;
const FRAME_TIME = 1000 / UPDATE_RATE;

const clientRoomNames = {};
let state = {};
let pausedState = {};
let game = null;
let gameCode = io.on("connection", (socket) => {
  socket.emit("init", { status: "connected" });
  socket.on("gameState", (state) => {
    console.log(state);
  });
  socket.on("createGame", handleNewGame);
  socket.on("gameCodeInput", handleGameJoin);
  socket.on("updateGameState", handleGameStateUpdate);
  socket.on("updatePausedState", handleFocusUpdate);

  function handleNewGame() {
    game = new Game();
    clientRoomNames[socket.id] = game.code;
    socket.join(game.code);
    socket.number = 0;
    game.addPlayer(socket.number);
    socket.emit("joined", { playerNumber: socket.number });
    socket.emit("gameCode", game.code);
  }

  function handleGameJoin(code) {
    gameCode = code;
    const room = io.sockets.adapter.rooms.get(gameCode);

    if (room) {
      socket.join(gameCode);
      socket.number = 1;
      clientRoomNames[socket.id] = gameCode;
      socket.emit("joined", { playerNumber: socket.number });

      game.addPlayer(socket.number);
      io.sockets.to(gameCode).emit("gameInitialization", {
        code: gameCode,
        seed: game.seed,
        width: game.width,
        height: game.height,
        players: [
          {
            x: game.players[0].x,
            y: game.players[0].y,
          },
          {
            x: game.players[1].x,
            y: game.players[1].y,
          },
        ],
      });
      startGameInterval();
    }
  }

  function handleGameStateUpdate({ playerNumber, ...data }) {
    //console.log('player number', playerNumber)
    if (!game) return;
    if (Object.keys(game.players) <= 1) return;
    state[playerNumber] = data;
    //game.players[playerNumber].updateState(data);
    //const newGameState = game.getState();
    //io.sockets.to(gameCode).emit("stateUpdate", newGameState);
  }

  function handleFocusUpdate({ playerNumber, paused }) {
    pausedState[playerNumber] = paused;
    io.sockets.to(gameCode).emit("pausedUpdate", pausedState);
  }

  let time = Date.now();
  let count = 0
  function startGameInterval() {
    const intervalId = setInterval(() => {
      count++;
      if (Date.now() - time >= 1000) {
        console.log(count,'state emits per second');
        count = 0;
        time = Date.now();
      }
      //const newGameState = game.getState();
      io.sockets.to(gameCode).emit("stateUpdate", state);
    }, FRAME_TIME);
  }
});

httpServer.listen(3100, () => {
  console.log("listening on *:3100");
});
