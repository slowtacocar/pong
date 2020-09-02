import Game from "../components/Game";

export default function Player2(props) {
  function handleMouseMove(event) {
    props.socket.emit('paddle2', {
      "x": event.clientX,
      "y": event.clientY
    });
  }
  
  return (
    <div onMouseMove={handleMouseMove}>
      <Game name="paddle2" socket={props.socket} />
    </div>
  );
}