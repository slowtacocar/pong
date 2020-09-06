const Player = require("./Player");

module.exports = class Game {
  constructor(room, io) {
    this.room = room;
    this.io = io;

    this.loop = this.loop.bind(this);
  }

  loop() {
    this.ball.x += this.vector.x;
    this.ball.y += this.vector.y;
    if (!this.player2.socket) {
      this.player2.offsetInc *=
        this.player2.offset >= 25 + this.speed
          ? -1
          : this.player2.offset <= -25 - this.speed
          ? -1
          : 1;
      this.player2.offset += this.player2.offsetInc;
      this.player2.y = this.ball.y + this.player2.offset;
      this.io.to(this.room).emit("player2", this.player2.y);
    }
    this.speed += 0.001;

    if (
      (this.vector.y > 0 && this.ball.y + 15 >= 500) ||
      (this.vector.y < 0 && this.ball.y - 15 <= 0)
    ) {
      this.vector.y *= -1;
    }
    if (
      this.vector.x < 0 &&
      this.ball.x - 15 <= 25 &&
      this.ball.y <= this.player1.y + 25 &&
      this.ball.y >= this.player1.y - 25
    ) {
      this.vector = {
        x: Math.cos((this.player1.y - this.ball.y) / -20) * this.speed,
        y: Math.sin((this.player1.y - this.ball.y) / -20) * this.speed,
      };
    } else if (
      this.vector.x > 0 &&
      this.ball.x + 15 >= 475 &&
      this.ball.y <= this.player2.y + 25 &&
      this.ball.y >= this.player2.y - 25
    ) {
      this.vector = {
        x: Math.cos((this.player2.y - this.ball.y) / 20 + Math.PI) * this.speed,
        y: Math.sin((this.player2.y - this.ball.y) / 20 + Math.PI) * this.speed,
      };
    } else if (this.vector.x < 0 && this.ball.x - 15 <= 0) {
      this.player2.score++;
      this.io.to(this.room).emit("score2", this.player2.score);
      this.restart();
    } else if (this.vector.x > 0 && this.ball.x + 15 >= 500) {
      this.player1.score++;
      this.io.to(this.room).emit("score1", this.player1.score);
      this.restart();
    }

    this.io.to(this.room).emit("ball", this.ball);
  }

  stop() {
    clearInterval(this.interval);
  }

  start() {
    if (this.player1 && this.player2) {
      this.speed = 3;

      const angle = Math.random() * 2 * Math.PI;
      this.vector = {
        x: Math.cos(angle) * this.speed,
        y: Math.sin(angle) * this.speed,
      };
      this.ball = {
        x: 250,
        y: 250,
      };

      this.interval = setInterval(this.loop, 50 / 3);
    }
  }

  restart() {
    this.stop();

    setTimeout(() => {
      this.start();
    }, 1000);
  }

  addPlayer(socket) {
    if (this.player1) {
      if (this.player2) {
        return null;
      }

      this.player2 = new Player(this.room, this.io, socket, "player2");
      this.start();

      socket.on("disconnect", () => {
        this.stop();
        delete this.player2;
      });

      return "player2";
    }

    this.player1 = new Player(this.room, this.io, socket, "player1");
    this.start();

    socket.on("disconnect", () => {
      this.stop();
      delete this.player1;
    });

    return "player1";
  }

  addOnlyPlayer(socket) {
    this.player1 = new Player(this.room, this.io, socket, "player1");
    this.player2 = {
      score: 0,
      y: 250,
      offsetInc: 1,
      offset: 0,
    };
    this.start();

    socket.on("disconnect", () => {
      this.stop();
    });
  }
};
