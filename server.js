const { Server } = require("socket.io");
const Game = require("./Game");
const options = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
};
const io = new Server(3100, options);
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
  socket.on("updateGameState", handleGameLoopUpdate);
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
      console.log(game.players);
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
    }
  }

  function handleGameLoopUpdate({ playerNumber, ...data }) {
    if (!game) return;
    game.players[playerNumber].updateState(data);

    const newGameState = game.getState();
    console.log('new', newGameState)

    io.sockets.to(gameCode).emit("stateUpdate", newGameState);
  }

  function handleFocusUpdate({ playerNumber, paused }) {
    pausedState[playerNumber] = paused;
    io.sockets.to(gameCode).emit("pausedUpdate", pausedState);
  }
});
