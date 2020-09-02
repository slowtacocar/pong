import styles from "./Lobby.module.css";

export default function Lobby(props) {
  const [component, setComponent] = React.useState()
  
  function handleSubmit(event) {
    event.preventDefault();
    setComponent(event.target.component.value);
    props.socket.emit('join', event.target.room.value);
  }
  
  return component ? props.children(component) : (
    <div className={styles.lobby}>
      <h1>Welcome!</h1>
      <p>Choose a room name and player to be added to your own personal game of Pong</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Room
          <input type="text" name="room" />
        </label>
        <label>
          Player
          <select name="component">
            <option value="player1">Player 1</option>
            <option value="player2">Player 2</option>
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}