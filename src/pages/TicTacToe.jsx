import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const emptyBoard = Array(9).fill(null)
const baseUrl = import.meta.env.VITE_API_BASE_URL || ''

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
  const [aiThinking, setAiThinking] = useState(false)
  const winner = calculateWinner(board)
  const isDraw = !winner && board.every(Boolean)
  const navigate = useNavigate()

  // AI move effect
  useEffect(() => {
    async function getAIMove() {
      setAiThinking(true)
      try {
        const res = await fetch(`${baseUrl}/api/tictactoe-ai-move`, {
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
    if (!winner && !isDraw && !xIsNext) {
      getAIMove()
    }
    // eslint-disable-next-line
  }, [board, xIsNext, winner, isDraw])

  function handleClick(idx) {
    if (board[idx] || winner || !xIsNext || aiThinking) return
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
    status = aiThinking ? "AI is thinking... 🤖" : "Your turn (X)"
  }

  return (
    <div className="app-container">
      <button
        style={{ position: 'absolute', left: 20, top: 20, zIndex: 200, fontSize: '1rem', padding: '8px 18px', borderRadius: 20, background: '#fff', color: '#764ba2', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        onClick={() => navigate('/')}
      >
        ← Back
      </button>
      <h1>Tic Tac Toe <span style={{fontSize:'1.2rem'}}>vs AI 🤖</span></h1>
      <div style={{ marginBottom: 20, fontSize: '1.2rem', fontWeight: 'bold' }}>{status}</div>
      <div className="ttt-board">
        {board.map((cell, idx) => (
          <button
            key={idx}
            className="ttt-cell"
            onClick={() => handleClick(idx)}
            disabled={!!cell || winner || !xIsNext || aiThinking}
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
        Mode: Player vs AI
      </div>
    </div>
  )
}

export default TicTacToe 

