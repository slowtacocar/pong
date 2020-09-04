module.exports = class Player {
  constructor(room, io, socket, paddleName) {
    this.room = room;
    this.io = io;
    this.socket = socket;
    this.paddleName = paddleName;

    this.y = 250;

    this.socket.join(this.room);

    this.socket.on(this.paddleName, (y) => {
      this.y = y;
      this.io.to(this.room).emit(this.paddleName, this.y);
    });
  }
};
