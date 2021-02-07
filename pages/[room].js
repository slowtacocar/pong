import { useRouter } from "next/router";
import io from "socket.io-client";
import Lobby from "../components/Lobby";

const socket = io("https://pong-server-slowtacocar.herokuapp.com");

export default function Home() {
  const router = useRouter();
  const { room } = router.query;

  return <Lobby socket={socket} room={room} />;
}
