import Paddle from "./Paddle";

function SocketPaddle(props) {
  const [y, setY] = React.useState(250);

  React.useEffect(() => {
    function handlePaddle(y) {
      setY(y);
    }

    props.socket.on(props.name, handlePaddle);

    return () => {
      props.socket.removeListener(props.name, handlePaddle);
    };
  }, [props.name, props.socket]);

  return <Paddle x={props.x} y={y} />;
}

export default SocketPaddle;
