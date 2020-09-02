import io from "socket.io-client";
import Player1 from "../components/Player1";
import Player2 from "../components/Player2";

const socket = io();

export default function Home() {
  const [component, setComponent] = React.useState()
  
  function handleSubmit(event) {
    event.preventDefault();
    setComponent(event.target.component.value);
    socket.emit('join', event.target.room.value);
  }
  
  return component === "player1" ? <Player1 socket={socket} /> : component === "player2" ? <Player2 socket={socket} /> : (
    <form onSubmit={handleSubmit}>
      <label>
        Room
        <input type="text" name="room" />
      </label>
      <label>
        Component
        <select name="component">
          <option value="player1">Player1</option>
          <option value="player2">Player2</option>
        </select>
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}