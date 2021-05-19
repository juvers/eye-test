import './App.css';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';

const Button = ({ className, value, onClick, id }) => {
  return <button className={className} value={value} onClick={onClick} id={id} />
}
const computeScores = (lottery, arr) => lottery.map(target => target.every(v => arr.includes(v)));
const createSquares = (num) => Array.from({ length: num }, (_, i) => i + 1);
const initialState = {
  hasTurn: true,
  scores: []
}
function App() {
  const lottery = useMemo(() => [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]], []);
  const parentRef = useRef();
  const [player1, setPlayer1] = useState({
    hasTurn: true,
    scores: []
  });
  const [player2, setPlayer2] = useState({
    hasTurn: false,
    scores: []
  });

  const [disabler, setDisabler] = useState(false);
  const getId = ({ target }) => {
    if (player1.hasTurn) {
      target.innerText = "X"
      setPlayer1({ ...player1, hasTurn: false, scores: [...player1.scores, Number(target.id)] });
      setPlayer2({ ...player2, hasTurn: true })
    }
    if (player2.hasTurn) {
      target.innerText = "O"
      setPlayer2({ ...player2, hasTurn: false, scores: [...player2.scores, Number(target.id)] });
      computeScores(lottery, player2.scores);
      setPlayer1({ ...player1, hasTurn: true });
    }
    target.setAttribute('disabled', true)
  };
  const reset = useCallback(() => {
    setDisabler(false);
    setPlayer1(initialState)
    setPlayer2({ ...initialState, hasTurn: false });
    const p = parentRef.current.childNodes;
    for (let i = 0; i < p.length; i++) {
      p[i].innerText = "";
      p[i].disabled = false;
    }
  }, [])
  useEffect(() => {
    if ((computeScores(lottery, player1.scores)).includes(true)) {
      alert("Player 1 has won");
       setDisabler(true);
    }
    if ((computeScores(lottery, player2.scores)).includes(true)) {
      alert("Player 2 has won");
      setDisabler(true);
    }
    if (player1.scores.length + player2.scores.length === 9) {
      const answer = window.confirm("would you like to replay? ");
      if (answer) reset();
    }
  }, [lottery, player1, player1.scores, player2.scores, reset])
  return (
    <div className="App">
      <header className="App-header">
        <div className="parent" ref={parentRef} style={disabler ? { pointerEvents: "none", opacity: "0.4" } : {}}>
          {createSquares(9).map(x => <Button key={x} className="box" value="" disabled={disabler} onClick={getId} id={x} />)}
        </div>
        <button className="btn" onClick={reset}>Replay</button>
        <br />
        <p>Player 1 payload</p>
        {JSON.stringify(player1)}
        <p>Player 2 payload</p>
        {JSON.stringify(player2)}
      </header>
    </div>
  );
}
export default App;
