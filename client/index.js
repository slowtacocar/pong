const socket = io();

const lobby = document.getElementById("lobby");
const game = document.getElementById("game");
const svg = document.getElementById("svg");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const ball = document.getElementById("ball");

let mouseY = 250;
let playerName;
let notPlayerName;
let player;
let notPlayer;

document.getElementById("room").addEventListener("change", (event) => {
  event.target.setCustomValidity("");
});

document.getElementById("form").addEventListener("submit", (event) => {
  event.preventDefault();

  if (event.target.room.value) {
    socket.emit("join", event.target.room.value, (component) => {
      if (component === null) {
        form.current.room.setCustomValidity("Room is full");
        form.current.submit.click();
      } else {
        playerName = component;
        startGame();
      }
    });
  }
});

document.getElementById("button").addEventListener("click", () => {
  socket.emit("play", (component) => {
    playerName = component;
    startGame();
  });
});

game.addEventListener("mousemove", (event) => {
  handleMove(event.clientY);
});

game.addEventListener("touchmove", (event) => {
  const [touch] = event.touches;
  handleMove(touch.clientY);
});

socket.on("score1", (score) => {
  score1.textContent = score;
});

socket.on("score2", (score) => {
  score2.textContent = score;
});

socket.on("ball", (data) => {
  socket.emit(playerName, mouseY);
  player.setAttribute("y", Math.min(475, Math.max(25, mouseY)) - 25);
  ball.setAttribute("cx", data.x);
  ball.setAttribute("cy", data.y);
});

function startGame() {
  lobby.hidden = true;
  game.hidden = false;
  player = document.getElementById(playerName);
  notPlayerName = playerName === "player1" ? "player2" : "player1";
  notPlayer = document.getElementById(notPlayerName);
  socket.on(notPlayerName, handlePaddle);
}

function handlePaddle(y) {
  notPlayer.setAttribute("y", Math.min(475, Math.max(25, y)) - 25);
}

function handleMove(clientY) {
  let point = svg.createSVGPoint();
  point.y = clientY;

  mouseY = point.matrixTransform(svg.getScreenCTM().inverse()).y;
}
