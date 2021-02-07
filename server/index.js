const express = require("express");
const http = require("http");
const next = require("next");
const Server = require("socket.io");
const GameServer = require("./GameServer");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const server = http.createServer(app);

  app.all("*", handle);

  const io = new Server(server);
  const gameServer = new GameServer(io);
  gameServer.start();

  server.listen(port);
});
