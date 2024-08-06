const GameServer = require("./GameServer");
const express = require("express");
const http = require("http");
const Server = require("socket.io");
const path = require("path");

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "../client")));

const gameServer = new GameServer(io);
gameServer.start();

server.listen(port);
