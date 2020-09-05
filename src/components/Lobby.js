import PropTypes from "prop-types";
import styles from "./Lobby.module.css";
import Game from "./Game";

function Lobby(props) {
  const [room, setRoom] = React.useState(props.room);
  const [component, setComponent] = React.useState();

  const form = React.useRef();

  React.useEffect(() => {
    if (props.room) setRoom(props.room);
  }, [props.room]);

  React.useEffect(() => {
    if (room) props.socket.emit("join", room, setComponent);
  }, [room, props.socket]);

  React.useEffect(() => {
    if (component === null) {
      form.current.room.setCustomValidity("Room is full");
      form.current.submit.click();
    }
  }, [component]);

  function handleChange(event) {
    event.target.setCustomValidity("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    setRoom(event.target.room.value);
  }

  return component ? (
    <Game name={component} socket={props.socket} />
  ) : (
    <div className={styles.lobby}>
      <h1>Welcome!</h1>
      <p>Choose any room name to be added to your own personal game of Pong</p>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        name="lobby"
        ref={form}
      >
        <label>
          Room
          <input type="text" name="room" onChange={handleChange} />
        </label>
        <button type="submit" name="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

Lobby.propTypes = {
  socket: PropTypes.object.isRequired,
  room: PropTypes.string,
};

export default Lobby;
