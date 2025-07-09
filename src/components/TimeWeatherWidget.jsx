import { useEffect, useState } from 'react'

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
function formatDate(date) {
  return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function TimeWeatherWidget({ onWeatherChange }) {
  const [now, setNow] = useState(new Date())
  const [weather, setWeather] = useState(null)
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Get geolocation and fetch weather
  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude })
      },
      err => setError('Location denied')
    )
  }, [])

  useEffect(() => {
    if (!location) return
    // Use Open-Meteo (no API key required)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.current_weather) {
          setWeather(data.current_weather)
          if (onWeatherChange) {
            onWeatherChange({
              code: data.current_weather.weathercode,
              temperature: data.current_weather.temperature
            })
          }
        } else setError('Weather unavailable')
      })
      .catch(() => setError('Weather fetch failed'))
  }, [location, onWeatherChange])

  return (
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      color: '#333',
      borderRadius: 16,
      boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
      padding: 20,
      minWidth: 260,
      minHeight: 120,
      position: 'fixed',
      bottom: 30,
      right: 30,
      zIndex: 1000,
      fontFamily: 'Arial',
      textAlign: 'center',
    }}>
      <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}>{formatDate(now)}</div>
      <div style={{ fontSize: 32, fontWeight: 'bold', letterSpacing: 2 }}>{formatTime(now)}</div>
      {weather && (
        <div style={{ marginTop: 8, fontSize: 16 }}>
          <span role="img" aria-label="weather">🌡️</span> {weather.temperature}°C &nbsp;
          <span style={{ fontSize: 13, color: '#666' }}>({weather.windspeed} km/h wind)</span>
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {!weather && !error && <div style={{ color: '#888', marginTop: 8 }}>Loading weather...</div>}
    </div>
  )
}

export default TimeWeatherWidget 