import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import HomeLanding from './pages/HomeLanding'
import LandingPage from './pages/LandingPage'
import CatchTheButtonGame from './pages/CatchTheButtonGame'
import TicTacToe from './pages/TicTacToe'
import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomeLanding />} />
          <Route path="/dashboard" element={<LandingPage />} />
          <Route path="/catch-the-button" element={<CatchTheButtonGame />} />
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
