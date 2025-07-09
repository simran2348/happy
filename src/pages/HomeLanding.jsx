import { useNavigate } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
import AnimatedWeather from '../components/AnimatedWeather'
import TimeWeatherWidget from '../components/TimeWeatherWidget'
import logo from '../assets/logo.png'
import logoDark from '../assets/logo-dark.png'
import '../App.css'

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 20) return 'evening'
  return 'night'
}

function HomeLanding() {
  const navigate = useNavigate()
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay())
  const [weatherCode, setWeatherCode] = useState(null)
  const logoSrc = timeOfDay === 'night' ? logoDark : logo

  // Update timeOfDay every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay())
    }, 60000)
    return () => clearInterval(interval)
  }, [])
  console.log(timeOfDay)
  return (
    <div className={`app-container dashboard-bg-${timeOfDay}`} style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
    }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 55, zIndex: 10, position: 'relative' }}>
        <img src={logoSrc} alt="Happy Company Logo" style={{ width: '50vw', maxWidth: 500, height: 'auto', objectFit: 'contain' }} />
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 100 }}>
        <button
          className="moving-button"
          style={{ minWidth: 250, fontSize: '1.2rem' }}
          onClick={() => navigate('/dashboard')}
        >
          Go to Game Dashboard 🎮
        </button>
      </div>
      <TimeWeatherWidget onWeatherChange={w => {
        setWeatherCode(w.code)
        console.log('Weather code from Open-Meteo:', w.code)
      }} />
      <AnimatedWeather timeOfDay={timeOfDay} weatherCode={weatherCode} />
    </div>
  )
}

export default HomeLanding 