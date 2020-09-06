module.exports = class Player {
  constructor(room, io, socket, paddleName) {
    this.room = room;
    this.io = io;
    this.socket = socket;
    this.paddleName = paddleName;
    this.score = 0;

    this.y = 250;

    this.socket.join(this.room);

    this.socket.on(this.paddleName, (y) => {
      this.y = Math.min(475, Math.max(25, y));
      this.io.to(this.room).emit(this.paddleName, this.y);
    });
  }
};
