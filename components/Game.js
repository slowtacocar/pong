import styles from "./Game.module.css";

export default function Game(props) {
  const paddles = {
    "paddle1": {
      "x": 20,
      "y": 250
    },
    "paddle2": {
      "x": 480,
      "y": 250
    }
  };

  const remoteName = props.name === "paddle1" ? "paddle2" : "paddle1";

  const [thisPaddle, setThisPaddle] = React.useState(paddles[props.name]);
  const [remotePaddle, setRemotePaddle] = React.useState(paddles[remoteName]);
  const [ball, setBall] = React.useState({
    "x": 250,
    "y": 250
  });

  React.useEffect(() => {
    function handleRemotePaddle(data) {
      setRemotePaddle(data);
    }

    props.socket.on(remoteName, handleRemotePaddle);

    function handleBall(data) {
      setBall(data);
    }

    props.socket.on("ball", handleBall);

    return () => {
      props.socket.removeListener(remoteName, handleRemotePaddle);
      props.socket.removeListener("ball", handleBall);
    };
  }, []);

  function handleMouseMove(event) {
    event.persist();

    props.socket.emit(props.name, {
      "x": event.clientX,
      "y": event.clientY
    });

    setThisPaddle((thisPaddle) => ({
      "x": thisPaddle.x,
      "y": Math.min(475, Math.max(25, event.clientY))
    }))
  }

  return (
    <div className={styles.game} onMouseMove={handleMouseMove}>
      <div className={styles.paddle} style={{
        "top": thisPaddle.y,
        "left": thisPaddle.x
      }} />
      <div className={styles.paddle} style={{
        "top": remotePaddle.y,
        "left": remotePaddle.x
      }} />
      <div className={styles.ball} style={{
        "top": ball.y,
        "left": ball.x
      }} />
    </div>
  );
}
