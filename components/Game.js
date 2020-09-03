import styles from "./Game.module.css";

export default function Game(props) {
  const svg = React.useRef();

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

    let mouse = svg.current.createSVGPoint()
    mouse.x = event.clientX
    mouse.y = event.clientY

    mouse = mouse.matrixTransform(svg.current.getScreenCTM().inverse())

    props.socket.emit(props.name, {
      "x": mouse.x,
      "y": mouse.y
    });

    setThisPaddle((thisPaddle) => ({
      "x": thisPaddle.x,
      "y": Math.min(475, Math.max(25, mouse.y))
    }))
  }

  return (
    <div onMouseMove={handleMouseMove}>
      <svg className={styles.svg} viewBox="-1 -1 502 502" ref={svg}>
        <rect width="501" height="501" x="-0.5" y="-0.5" stroke="rgb(255, 255, 255)" />
        <rect width="10" height="50" x={thisPaddle.x - 5} y={thisPaddle.y - 25} fill="rgb(255, 255, 255)" />
        <rect width="10" height="50" x={remotePaddle.x - 5} y={remotePaddle.y - 25} fill="rgb(255, 255, 255)" />
        <circle cx={ball.x} cy={ball.y} r="15" fill="rgb(255, 255, 255)" />
      </svg>
    </div>
  );
}
