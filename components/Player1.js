import Game from "../components/Game";

export default function Player1(props) {
  function handleMouseMove(event) {
    props.socket.emit('paddle1', {
      "x": event.clientX,
      "y": event.clientY
    });
  }
  
  return (
    <div onMouseMove={handleMouseMove}>
      <Game name="paddle1" socket={props.socket} />
    </div>
  );
}