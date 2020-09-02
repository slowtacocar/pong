import io from "socket.io-client";
import Lobby from "../components/Lobby";
import Game from "../components/Game";

const socket = io();

export default function Home() {
  return (
    <Lobby socket={socket}>
      {
        (component) => component === "player1" ?
          <Game name="paddle1" socket={socket} /> :
          component === "player2" ?
            <Game name="paddle2" socket={socket} /> :
            null
      }
    </Lobby>
  );
}
