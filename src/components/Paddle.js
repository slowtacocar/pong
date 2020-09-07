import PropTypes from "prop-types";

function Paddle(props) {
  return (
    <rect
      width="10"
      height="50"
      x={props.x}
      y={Math.min(475, Math.max(25, props.y)) - 25}
      fill="rgb(255, 255, 255)"
    />
  );
}

Paddle.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

export default Paddle;