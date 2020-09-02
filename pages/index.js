import io from "socket.io-client";
import Lobby from "../components/Lobby";
import Player1 from "../components/Player1";
import Player2 from "../components/Player2";

const socket = io();

export default function Home() {
  return (
    <Lobby socket={socket}>
      {
        (component) => component === "player1" ?
          <Player1 socket={socket} /> :
          component === "player2" ?
            <Player2 socket={socket} /> :
            null
      }
    </Lobby>
  );
}
