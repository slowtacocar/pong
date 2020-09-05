import PropTypes from "prop-types";
import styles from "./Game.module.css";
import Ball from "./Ball";
import Paddle from "./Paddle";
import SocketPaddle from "./SocketPaddle";
import Score from "./Score";

function Game(props) {
  const svg = React.useRef();

  const [y, setY] = React.useState(250);

  function handleMove(clientY) {
    let point = svg.current.createSVGPoint();
    point.y = clientY;

    const { y } = point.matrixTransform(svg.current.getScreenCTM().inverse());

    props.socket.emit(props.name, y);

    setY(y);
  }

  function handleMouseMove(event) {
    handleMove(event.clientY);
  }

  function handleTouchMove(event) {
    const [touch] = event.touches;
    handleMove(touch.clientY);
  }

  return (
    <div
      className={styles.container}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      <svg className={styles.svg} viewBox="-1 -1 502 502" ref={svg}>
        <rect
          width="501"
          height="501"
          x="-0.5"
          y="-0.5"
          stroke="rgb(255, 255, 255)"
        />
        <line
          x1="250"
          y1="0"
          x2="250"
          y2="500"
          stroke="rgb(255, 255, 255)"
          strokeDasharray="5"
        />
        <Paddle y={y} x={props.name === "player1" ? 15 : 475} />
        <SocketPaddle
          x={props.name === "player2" ? 15 : 475}
          socket={props.socket}
          name={props.name === "player1" ? "player2" : "player1"}
        />
        <Ball socket={props.socket} />
        <Score socket={props.socket} name="score1" />
        <Score socket={props.socket} name="score2" />
      </svg>
    </div>
  );
}

Game.propTypes = {
  socket: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
};

export default Game;
