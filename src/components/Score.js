import PropTypes from "prop-types";

function Score(props) {
  const [score, setScore] = React.useState(0);

  React.useEffect(() => {
    function handleScore(score) {
      setScore(score);
    }

    props.socket.on(props.name, handleScore);

    return () => {
      props.socket.removeListener(props.name, handleScore);
    };
  }, [props.name, props.socket]);

  return (
    <text
      textAnchor={props.name === "score1" ? "start" : "end"}
      dominantBaseline="hanging"
      x={props.name === "score1" ? 10 : 490}
      y="10"
      fill="rgb(255, 255, 255)"
      fontSize="35"
    >
      {score}
    </text>
  );
}

Score.propTypes = {
  name: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired,
};

export default Score;
