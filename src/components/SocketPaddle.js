import PropTypes from "prop-types";
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

SocketPaddle.propTypes = {
  socket: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
};

export default SocketPaddle;
