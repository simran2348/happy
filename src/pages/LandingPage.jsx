import { useNavigate } from 'react-router-dom'
import '../App.css'

function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="app-container">
      <h1>Welcome to Happy Company!</h1>
      <p style={{ fontSize: '1.3rem', marginBottom: '2rem', maxWidth: 500 }}>
        Our mission: Make everyone smile! Play fun, witty games and boost your happiness. More games coming soon!
      </p>
      <button
        className="moving-button"
        style={{ minWidth: 250, fontSize: '1.2rem', marginBottom: 20 }}
        onClick={() => navigate('/catch-the-button')}
      >
        Play "Catch the Button" 🎯
      </button>
      <br />
      <button
        className="moving-button"
        style={{ minWidth: 250, fontSize: '1.2rem', marginBottom: 20 }}
        onClick={() => navigate('/tic-tac-toe')}
      >
        Play "Tic Tac Toe" ❌⭕
      </button>
      <br />
      <button
        className="moving-button"
        style={{ minWidth: 250, fontSize: '1.2rem', marginBottom: 20 }}
        onClick={() => navigate('/tic-tac-toe?ai=1')}
      >
        Play "Tic Tac Toe vs AI" 🤖
      </button>
    </div>
  )
}

export default LandingPage 