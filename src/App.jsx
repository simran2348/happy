import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CatchTheButtonGame from './pages/CatchTheButtonGame'
import TicTacToe from './pages/TicTacToe'
import HappyChatBox from './components/HappyChatBox'
import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/catch-the-button" element={<CatchTheButtonGame />} />
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
        </Routes>
      </Router>
      <HappyChatBox />
    </>
  )
}

export default App
