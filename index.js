import http from "http";
import { Server } from "node-static";
import { WebSocketServer } from "ws";

const fileServer = new Server("./public");
const server = http.createServer((req, res) => {
  fileServer.serve(req, res);
});
const wss = new WebSocketServer({ server });

const games = {};

wss.on("connection", (ws) => {
  let room = null;

  ws.on("message", (m) => {
    const message = JSON.parse(m);
    if (message.room) {
      room = message.room;
      if (!games[room]) {
        games[room] = [];
      }

      const playerNumber = games[room].length;
      if (playerNumber < 2) {
        games[room][playerNumber] = ws;

        if (games[room].length >= 2) {
          const ball = resetBall();
          for (const otherWs of games[room]) {
            if (ws !== otherWs) {
              otherWs.send(
                JSON.stringify({
                  ball,
                })
              );
            } else {
              otherWs.send(
                JSON.stringify({
                  ball,
                  playerNumber,
                })
              );
            }
          }
        } else {
          ws.send(JSON.stringify({ playerNumber }));
        }
      } else {
        ws.send(JSON.stringify({ playerNumber: null }));
      }
    }

    if (message.score) {
      for (const otherWs of games[room]) {
        if (ws !== otherWs) {
          otherWs.send(
            JSON.stringify({
              score: message.score,
            })
          );
        }
      }

      setTimeout(() => {
        const ball = resetBall();
        for (const ws of games[room]) {
          ws.send(
            JSON.stringify({
              ball,
            })
          );
        }
      }, 1000);
    }

    if (message.paddle) {
      for (const otherWs of games[room]) {
        if (ws !== otherWs) {
          otherWs.send(
            JSON.stringify({
              paddle: message.paddle,
            })
          );
        }
      }
    }

    if (message.bounce) {
      for (const otherWs of games[room]) {
        if (ws !== otherWs) {
          otherWs.send(
            JSON.stringify({
              ball: message.bounce,
            })
          );
        }
      }
    }
  });
});

server.listen(process.env.PORT || 3000);

function resetBall() {
  const angle =
    (Math.random() >= 0.5 ? Math.PI : 0) + Math.random() * 2.5 - 1.25;
  return {
    dx: Math.cos(angle),
    dy: Math.sin(angle),
    x: 250,
    y: 250,
    timestamp: Date.now(),
    s: 0.2,
  };
}
