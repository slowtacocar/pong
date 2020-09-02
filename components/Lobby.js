import styles from './Lobby.module.css';

export default function Lobby(props) {
  const [component, setComponent] = React.useState()

  function handleChange(event) {
    event.target.setCustomValidity('')
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.socket.emit('join', event.target.room.value, (component) => {
      if (component) {
        setComponent(component);
      } else {
        event.target.room.setCustomValidity('Room is full');
        event.target.submit.click();
      }
    });
  }

  return component ? props.children(component) : (
    <div className={styles.lobby}>
      <h1>Welcome!</h1>
      <p>
        Choose any room name to be added to your own personal game of Pong
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Room
          <input type='text' name='room' onChange={handleChange} />
        </label>
        <button type='submit' name='submit'>Submit</button>
      </form>
    </div>
  );
}
