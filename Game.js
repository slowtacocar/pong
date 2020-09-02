const Player = require('./Player')

const SPEED = 3

module.exports = class Game {
  constructor(room, io) {
    this.room = room
    this.io = io

    this.loop = this.loop.bind(this)
  }

  loop() {
    this.ball.x += this.vector.x
    this.ball.y += this.vector.y

    if (this.vector.x > 0 && this.ball.x + 15 >= 500) {
      this.restart();
    }
    if (this.vector.y > 0 && this.ball.y + 15 >= 500) {
      this.vector.y *= -1
    }
    if (this.vector.x < 0 && this.ball.x - 15 <= 0) {
      this.restart();
    }
    if (this.vector.y < 0 && this.ball.y - 15 <= 0) {
      this.vector.y *= -1
    }
    if (this.vector.x < 0 && this.ball.x - 15 <= this.player1.paddle.x + 5 && this.ball.x - 15 >= this.player1.paddle.x - 5 && this.ball.y <= this.player1.paddle.y + 25 && this.ball.y >= this.player1.paddle.y - 25) {
      this.vector = {
        'x': Math.cos((this.player1.paddle.y - this.ball.y) / -20) * SPEED,
        'y': Math.sin((this.player1.paddle.y - this.ball.y) / -20) * SPEED
      }
    }
    if (this.vector.x > 0 && this.ball.x + 15 >= this.player2.paddle.x - 5 && this.ball.x + 15 <= this.player2.paddle.x + 5 && this.ball.y <= this.player2.paddle.y + 25 && this.ball.y >= this.player2.paddle.y - 25) {
      this.vector = {
        'x': Math.cos((this.player2.paddle.y - this.ball.y) / 20 + Math.PI) * SPEED,
        'y': Math.sin((this.player2.paddle.y - this.ball.y) / 20 + Math.PI) * SPEED
      }
    }

    this.io.to(this.room).emit('ball', this.ball)
  }

  stop() {
    clearInterval(this.interval)
  }

  start() {
    if (this.player1 && this.player2) {
      this.vector = {
        'x': SPEED,
        'y': 0
      }
      this.ball = {
        'x': 250,
        'y': 250
      }

      this.interval = setInterval(this.loop, 50 / 3)
    }
  }

  restart() {
    this.stop()

    setTimeout(() => {
      this.start()
    }, 1000)
  }

  addPlayer(socket) {
    if (this.player1) {
      if (this.player2) {
        return null
      }

      this.player2 = new Player(this.room, this.io, socket, 'paddle2')
      this.start()

      socket.on('disconnect', () => {
        this.stop()
        delete this.player2
      })

      return 'player2'
    }

    this.player1 = new Player(this.room, this.io, socket, 'paddle1')
    this.start()

    socket.on('disconnect', () => {
      this.stop()
      delete this.player1
    })

    return 'player1'
  }
}
