const Game = require("./Game");

module.exports = class GameServer {
  constructor(io) {
    this.io = io;
    this.games = {};
  }

  joinPlayer(room, socket) {
    if (!this.games[room]) {
      this.games[room] = new Game(room, this.io);
    }

    return this.games[room].addPlayer(socket);
  }

  start() {
    this.io.on("connection", (socket) => {
      socket.on("join", (room, ack) => {
        const component = this.joinPlayer(room, socket);

        ack(component);
      });
      socket.on("play", (ack) => {
        this.games[socket.id] = new Game(socket.id, this.io);
        this.games[socket.id].addOnlyPlayer(socket);

        ack("player1");
      });
    });
  }
};
