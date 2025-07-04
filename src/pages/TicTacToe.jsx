import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import '../App.css'

const emptyBoard = Array(9).fill(null)

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let line of lines) {
    const [a, b, c] = line
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function TicTacToe() {
  const [board, setBoard] = useState(emptyBoard)
  const [xIsNext, setXIsNext] = useState(true)
  const [searchParams] = useSearchParams()
  const [aiThinking, setAiThinking] = useState(false)
  const aiMode = searchParams.get('ai') === '1'
  const winner = calculateWinner(board)
  const isDraw = !winner && board.every(Boolean)
  const navigate = useNavigate()

  // AI move effect
  useEffect(() => {
    async function getAIMove() {
      setAiThinking(true)
      try {
        const res = await fetch('http://localhost:3001/api/tictactoe-ai-move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ board })
        })
        const data = await res.json()
        if (typeof data.move === 'number' && !board[data.move]) {
          const newBoard = board.slice()
          newBoard[data.move] = 'O'
          setTimeout(() => {
            setBoard(newBoard)
            setXIsNext(true)
            setAiThinking(false)
          }, 500) // AI "thinking" delay
        } else {
          setAiThinking(false)
        }
      } catch (err) {
        setAiThinking(false)
      }
    }
    if (aiMode && !winner && !isDraw && !xIsNext) {
      getAIMove()
    }
    // eslint-disable-next-line
  }, [aiMode, board, xIsNext, winner, isDraw])

  function handleClick(idx) {
    if (board[idx] || winner || (aiMode && (!xIsNext || aiThinking))) return
    const newBoard = board.slice()
    newBoard[idx] = 'X'
    setBoard(newBoard)
    setXIsNext(false)
  }

  function handleRestart() {
    setBoard(emptyBoard)
    setXIsNext(true)
    setAiThinking(false)
  }

  let status
  if (winner) {
    status = `Winner: ${winner}`
  } else if (isDraw) {
    status = "It's a draw!"
  } else {
    if (aiMode) {
      status = aiThinking ? "AI is thinking... 🤖" : xIsNext ? "Your turn (X)" : "AI's turn (O) 🤖"
    } else {
      status = `Next turn: ${xIsNext ? 'X' : 'O'}`
    }
  }

  return (
    <div className="app-container">
      <button
        style={{ position: 'absolute', left: 20, top: 20, zIndex: 200, fontSize: '1rem', padding: '8px 18px', borderRadius: 20, background: '#fff', color: '#764ba2', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        onClick={() => navigate('/')}
      >
        ← Back
      </button>
      <h1>Tic Tac Toe {aiMode && <span style={{fontSize:'1.2rem'}}>vs AI 🤖</span>}</h1>
      <div style={{ marginBottom: 20, fontSize: '1.2rem', fontWeight: 'bold' }}>{status}</div>
      <div className="ttt-board">
        {board.map((cell, idx) => (
          <button
            key={idx}
            className="ttt-cell"
            onClick={() => handleClick(idx)}
            disabled={!!cell || winner || (aiMode && (!xIsNext || aiThinking))}
          >
            {cell}
          </button>
        ))}
      </div>
      <button
        style={{ marginTop: 30, fontSize: '1rem', padding: '10px 30px', borderRadius: 20, background: '#fff', color: '#764ba2', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        onClick={handleRestart}
      >
        Restart
      </button>
      <div style={{marginTop: 20, fontSize: '1rem', color: '#fff', opacity: 0.7}}>
        Mode: {aiMode ? 'Player vs AI' : 'Player vs Player'}
      </div>
    </div>
  )
}

export default TicTacToe 