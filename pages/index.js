import io from "socket.io-client";
import Lobby from "../components/Lobby";

const socket = io("https://pong-server-slowtacocar.herokuapp.com/");

export default function Home() {
  return <Lobby socket={socket} />;
}
