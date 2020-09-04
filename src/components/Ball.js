export default function Ball(props) {
  const [ball, setBall] = React.useState({
    x: 250,
    y: 250,
  });

  React.useEffect(() => {
    function handleBall(data) {
      setBall(data);
    }

    props.socket.on("ball", handleBall);

    return () => {
      props.socket.removeListener("ball", handleBall);
    };
  }, [props.socket]);

  return <circle cx={ball.x} cy={ball.y} r="15" fill="rgb(255, 255, 255)" />;
}
