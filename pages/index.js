import io from "socket.io-client";
import Lobby from "../components/Lobby";

const socket = io();

export default function Home() {
  return <Lobby socket={socket} />;
}
