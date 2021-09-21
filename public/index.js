const socket = new WebSocket("ws://pong.slowtacocar.com");

const lobby = document.getElementById("lobby");
const game = document.getElementById("game");
const svg = document.getElementById("svg");
const scores = [
  document.getElementById("score1"),
  document.getElementById("score2"),
];
const players = [
  document.getElementById("player1"),
  document.getElementById("player2"),
];
const ball = document.getElementById("ball");
const form = document.getElementById("form");
const submit = form.querySelector("button[type=submit]");

let score = 0;
let otherScore = 0;
let paddle = 250;
let otherPaddle = 250;
let ballDx0 = 0;
let ballDy0 = 0;
let ballX0 = 250;
let ballY0 = 250;
let t0 = 0;
let s0 = 0.2;
let playerNumber = null;
let stop = false;

document.getElementById("room").addEventListener("change", (event) => {
  event.target.setCustomValidity("");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (event.target.room.value) {
    socket.send(JSON.stringify({ room: event.target.room.value }));
  }
});

document.getElementById("button").addEventListener("click", () => {
  // TODO single player
  /*
  if (!this.player2.socket) {
    const limits =
      1.5 *
      (25 + this.speed) *
      Math.atan2(Math.abs(this.vector.y), Math.abs(this.vector.x));
    this.player2.offsetInc =
      this.player2.offset >= limits
        ? -1
        : this.player2.offset <= -limits
        ? 1
        : this.player2.offsetInc;
    this.player2.offset += this.player2.offsetInc;
    this.player2.y = Math.min(
      475,
      Math.max(25, this.ball.y + this.player2.offset)
    );
    this.io.to(this.room).emit("player2", this.player2.y);
  }
  */
});

game.addEventListener("mousemove", (event) => {
  handleMove(event.clientY);
});

game.addEventListener("touchmove", (event) => {
  const [touch] = event.touches;
  handleMove(touch.clientY);
});

socket.addEventListener("message", (m) => {
  const message = JSON.parse(m.data);

  if (message.playerNumber === null) {
    form.room.setCustomValidity("Room is full");
    submit.click();
  } else if (message.playerNumber != null) {
    playerNumber = message.playerNumber;
    lobby.hidden = true;
    game.hidden = false;
    window.requestAnimationFrame(frame);
  }
  if (message.ball) {
    ballDx0 = message.ball.dx;
    ballDy0 = message.ball.dy;
    ballX0 = message.ball.x;
    ballY0 = message.ball.y;
    t0 = message.ball.timestamp;
    s0 = message.ball.s;
    stop = false;
  }
  if (message.score) {
    score++;
    stop = true;
    ball.setAttribute("cx", message.score.x);
    ball.setAttribute("cy", message.score.y);
  }
  if (message.paddle) {
    otherPaddle = message.paddle;
  }
});

function handleMove(clientY) {
  let point = svg.createSVGPoint();
  point.y = clientY;

  paddle = Math.min(
    475,
    Math.max(25, point.matrixTransform(svg.getScreenCTM().inverse()).y)
  );
}

function frame() {
  for (let i = 0; i < 2; i++) {
    if (i === playerNumber) {
      players[i].setAttribute("y", paddle - 25);
      scores[i].textContent = score;
    } else {
      players[i].setAttribute("y", otherPaddle - 25);
      scores[i].textContent = otherScore;
    }
  }

  if (!stop) {
    const t = Date.now() - t0;

    const s = s0 + t * 0.000002;
    const ballX = ballX0 + t * ballDx0 * s;
    console.log(ballY0 + t * ballDy0 * s - 15);
    const ballY =
      485 -
      Math.abs(((((ballY0 + t * ballDy0 * s - 15) % 940) + 940) % 940) - 470);

    ball.setAttribute("cx", ballX);
    ball.setAttribute("cy", ballY);

    if (
      playerNumber === 0 &&
      ballDx0 < 0 &&
      ballX - 15 <= 25 &&
      ballY <= paddle + 25 &&
      ballY >= paddle - 25
    ) {
      t0 = Date.now();
      ballX0 = ballX;
      ballY0 = ballY;
      ballDx0 = Math.cos((paddle - ballY) / -20);
      ballDy0 = Math.sin((paddle - ballY) / -20);
      s0 = s;
      socket.send(
        JSON.stringify({
          bounce: {
            timestamp: t0,
            x: ballX0,
            y: ballY0,
            dx: ballDx0,
            dy: ballDy0,
            s: s0,
          },
        })
      );
    } else if (
      playerNumber === 1 &&
      ballDx0 > 0 &&
      ballX + 15 >= 475 &&
      ballY <= paddle + 25 &&
      ballY >= paddle - 25
    ) {
      t0 = Date.now();
      ballX0 = ballX;
      ballY0 = ballY;
      ballDx0 = Math.cos((paddle - ballY) / 20 + Math.PI);
      ballDy0 = Math.sin((paddle - ballY) / 20 + Math.PI);
      s0 = s;
      socket.send(
        JSON.stringify({
          bounce: {
            timestamp: t0,
            x: ballX0,
            y: ballY0,
            dx: ballDx0,
            dy: ballDy0,
            s: s0,
          },
        })
      );
    } else if (
      (playerNumber === 0 && ballDx0 < 0 && ballX - 15 <= 0) ||
      (playerNumber === 1 && ballDx0 > 0 && ballX + 15 >= 500)
    ) {
      otherScore++;
      socket.send(JSON.stringify({ score: { x: ballX, y: ballY } }));
      stop = true;
    }
  }

  window.requestAnimationFrame(frame);
  socket.send(JSON.stringify({ paddle }));
}
