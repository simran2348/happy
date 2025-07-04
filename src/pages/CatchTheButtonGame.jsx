import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

function CatchTheButtonGame() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    moveToRandomPosition()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const moveToRandomPosition = () => {
    const maxX = window.innerWidth - 250
    const maxY = window.innerHeight - 50
    const minDistance = 150
    let newX, newY
    let attempts = 0
    const maxAttempts = 50
    do {
      newX = Math.random() * maxX
      newY = Math.random() * maxY
      attempts++
      const distance = Math.sqrt(
        Math.pow(newX - mousePosition.x, 2) +
        Math.pow(newY - mousePosition.y, 2)
      )
      if (distance >= minDistance) {
        break
      }
    } while (attempts < maxAttempts)
    setPosition({ x: newX, y: newY })
  }

  const handleMouseEnter = () => {
    moveToRandomPosition()
  }

  return (
    <div className="app-container">
      <button
        style={{ position: 'absolute', left: 20, top: 20, zIndex: 200, fontSize: '1rem', padding: '8px 18px', borderRadius: 20, background: '#fff', color: '#764ba2', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        onClick={() => navigate('/')}
      >
        ← Back
      </button>
      <h1>Moving Button Game</h1>
      <p>Try to catch the button with your mouse!</p>
      <button
        className="moving-button"
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={handleMouseEnter}
      >
        Catch me if you can! 🎯
      </button>
    </div>
  )
}

export default CatchTheButtonGame 