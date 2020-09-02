module.exports = class Player {
  constructor(room, io, socket, paddleName) {
    this.room = room
    this.io = io
    this.socket = socket
    this.paddleName = paddleName

    this.paddle = this.paddleName === 'paddle1' ? {
      'x': 20,
      'y': 250
    } : {
      'x': 480,
      'y': 250
    }

    this.socket.join(this.room)

    this.socket.on(this.paddleName, (data) => {
      this.paddle.y = Math.min(475, Math.max(25, data.y))
      this.io.to(this.room).emit(this.paddleName, this.paddle)
    })
  }
}
