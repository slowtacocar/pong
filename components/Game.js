import styles from "./Game.module.css";

export default function Game(props) {
  const [paddle1, setPaddle1] = React.useState({
    "x": 20,
    "y": 250
  });
  const [paddle2, setPaddle2] = React.useState({
    "x": 480,
    "y": 250
  });
  const [ball, setBall] = React.useState({
    "x": 250,
    "y": 250
  });
  
  React.useEffect(() => {
    function handlePaddle1(data) {
      setPaddle1(data);
    }

    props.socket.on("paddle1", handlePaddle1);
    
    function handlePaddle2(data) {
      setPaddle2(data);
    }
    
    props.socket.on("paddle2", handlePaddle2);
    
    function handleBall(data) {
      setBall(data);
    }
    
    props.socket.on("ball", handleBall);
    
    return () => {
      props.socket.removeListener("paddle1", handlePaddle1);
      props.socket.removeListener("paddle2", handlePaddle2);
      props.socket.removeListener("ball", handleBall);
    };
  }, []);
  
  return (
    <div className={styles.game}>
      <div className={styles.paddle} style={{
        "top": paddle1.y,
        "left": paddle1.x
      }} />
      <div className={styles.paddle} style={{
        "top": paddle2.y,
        "left": paddle2.x
      }} />
      <div className={styles.ball} style={{
        "top": ball.y,
        "left": ball.x
      }} />
    </div>
  );
}
