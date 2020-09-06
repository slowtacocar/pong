import PropTypes from "prop-types";

function Ball(props) {
  const [ball, setBall] = React.useState({
    x: 250,
    y: 250,
  });

  React.useEffect(() => {
    function handleBall(data) {
      props.onFrame();
      setBall(data);
    }

    props.socket.on("ball", handleBall);

    return () => {
      props.socket.removeListener("ball", handleBall);
    };
  }, [props]);

  return <circle cx={ball.x} cy={ball.y} r="15" fill="rgb(255, 255, 255)" />;
}

Ball.propTypes = {
  socket: PropTypes.object.isRequired,
  onFrame: PropTypes.func.isRequired,
};

export default Ball;
