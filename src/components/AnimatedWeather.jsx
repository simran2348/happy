import './AnimatedWeather.css'
import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import cloudAnimation from '../assets/clouds.json'
import birdAnimation from '../assets/birds.json'
import birdDarkAnimation from '../assets/birds-dark.json'

function getSunPosition() {
  const hour = new Date().getHours();
  // 5am (5) to 20pm (20) is day, 0-15
  const dayHour = Math.max(0, Math.min(15, hour - 5));
  const left = (dayHour / 15) * 100; // 0vw to 100vw
  // Arc: high at noon, low at sunrise/set
  const top = 30 - Math.sin((dayHour / 15) * Math.PI) * 20; // 30vh to 10vh arc
  return { left: `${left}vw`, top: `${top}vh` };
}

function CrescentMoon() {
  // Top right, large crescent with spots
  return (
    <svg
      width="110" height="110" viewBox="0 0 110 110"
      style={{ position: 'absolute', right: '2vw', top: '2vh', zIndex: 3, transform: 'scaleX(-1)' }}
    >
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#e0e0e0" stopOpacity="0.7" />
        </radialGradient>
      </defs>
      {/* Main crescent shape: big white circle, then a slightly offset smaller circle with transparent fill to cut out crescent */}
      <circle cx="55" cy="55" r="50" fill="url(#moonGlow)" />
      <circle cx="75" cy="55" r="44" fill="#0000" />
      {/* Moon spots (craters) */}
      <circle cx="60" cy="40" r="7" fill="#e0e0e0" opacity="0.45" />
      <circle cx="80" cy="60" r="5" fill="#d0d0d0" opacity="0.32" />
      <circle cx="65" cy="75" r="4" fill="#c0c0c0" opacity="0.28" />
      <circle cx="50" cy="65" r="3" fill="#b0b0b0" opacity="0.22" />
    </svg>
  );
}

function ShootingStar() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!show) {
      const timeout = setTimeout(() => setShow(true), 8000 + Math.random() * 12000)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => setShow(false), 1200)
      return () => clearTimeout(timeout)
    }
  }, [show])
  if (!show) return null
  const top = 10 + Math.random() * 30 // 10vh to 40vh
  return <div className="shooting-star" style={{ top: `${top}vh` }} />
}

function Rain({ drizzle }) {
  const dropCount = drizzle ? 10 : 30
  const dropWidth = drizzle ? 1.2 : 2.2
  const dropHeight = drizzle ? 16 : 22
  const dropOpacity = drizzle ? 0.5 : 0.8
  return <div className="rain-effect">{
    Array.from({length: dropCount}).map((_,i) => {
      const left = Math.random() * 98 + 1;
      const delay = Math.random() * 1.2;
      const wind = Math.random() * 10 - 5;
      return <div key={i} className="raindrop" style={{ left: `${left}vw`, animationDelay: `${delay}s`, '--wind': `${wind}vw`, width: dropWidth, height: dropHeight, opacity: dropOpacity }} />
    })
  }</div>
}
function Snow() {
  return <div className="snow-effect">{
    Array.from({length: 20}).map((_,i) => {
      const left = Math.random() * 98 + 1;
      const delay = Math.random() * 2;
      const wind = Math.random() * 20 - 10;
      return <div key={i} className="snowflake" style={{ left: `${left}vw`, animationDelay: `${delay}s`, '--wind': `${wind}vw` }} />
    })
  }</div>
}
function Fog() {
  return <div className="fog-effect"><div className="fog-layer" /><div className="fog-layer fog-layer2" /></div>
}
function Lightning() {
  return <div className="lightning-effect"><div className="lightning" /></div>
}
function Birds({ timeOfDay }) {
  if (timeOfDay !== 'morning' && timeOfDay !== 'afternoon') return null
  return (
    <div className="birds-effect">
      {Array.from({ length: 5 }).map((_, i) => {
        const delay = i * 2.5
        const top = 18 + i * 4 + Math.random() * 4
        return (
          <svg
            key={i}
            className="bird-svg"
            style={{ animationDelay: `${delay}s`, top: `${top}vh` }}
            width="48" height="24" viewBox="0 0 48 24" fill="none"
          >
            <path
              className="bird-wing"
              d="M2,22 Q24,2 46,22"
              stroke="#222"
              strokeWidth="2.5"
              fill="none"
            />
            <path
              className="bird-body"
              d="M22,18 Q24,20 26,18"
              stroke="#222"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        )
      })}
    </div>
  )
}
function Rainbow({ show }) {
  return show ? <div className="rainbow-effect" /> : null
}

function generateClouds(timeOfDay, isCloudy) {
  // More clouds if cloudy, fewer if clear
  const minClouds = isCloudy ? 6 : 3
  const maxClouds = isCloudy ? 10 : 6
  const count = Math.floor(Math.random() * (maxClouds - minClouds + 1)) + minClouds
  const clouds = []
  for (let i = 0; i < count; i++) {
    // Size: 80-220px wide
    const width = 80 + Math.random() * 140
    // Height: 30-70px
    const height = 30 + Math.random() * 40
    // Position: top 5-40vh, left 0-90vw
    const top = 5 + Math.random() * 35
    const left = Math.random() * 90
    // Color: vary by time of day
    let base = 255, tint = 255, alpha = 0.85
    if (timeOfDay === 'evening') { base = 230; tint = 210; alpha = 0.8 }
    if (timeOfDay === 'night') { base = 200; tint = 220; alpha = 0.7 }
    if (isCloudy) { base -= 20; tint -= 20; alpha = 0.9 }
    // Add a little random blue/gray
    const r = base + Math.floor(Math.random() * 10)
    const g = base + Math.floor(Math.random() * 10)
    const b = tint + Math.floor(Math.random() * 20)
    clouds.push({
      id: i + '-' + Date.now(),
      width,
      height,
      top,
      left,
      color: `rgba(${r},${g},${b},${alpha})`
    })
  }
  return clouds
}

function DynamicClouds({ timeOfDay, isCloudy }) {
  const [clouds, setClouds] = useState(() => generateClouds(timeOfDay, isCloudy))
  useEffect(() => {
    setClouds(generateClouds(timeOfDay, isCloudy))
  }, [timeOfDay, isCloudy])
  return (
    <>
      {clouds.map(cloud => (
        <div
          key={cloud.id}
          className="cloud"
          style={{
            position: 'absolute',
            top: `${cloud.top}vh`,
            left: `${cloud.left}vw`,
            width: cloud.width,
            height: cloud.height,
            background: cloud.color,
            opacity: 1,
            zIndex: 2,
            filter: 'blur(0.5px)',
            borderRadius: '50% / 40%',
            boxShadow: `0 8px 32px 0 rgba(0,0,0,0.08)`
          }}
        />
      ))}
    </>
  )
}

function LottieClouds() {
  return (
    <div style={{
      position: 'absolute',
      width: '100vw',
      height: '100vh',
      zIndex: 2,
      pointerEvents: 'none',
      // display: 'flex',
      // justifyContent: 'center',
      // alignItems: 'center'
    }}>
      <Lottie
        animationData={cloudAnimation}
        loop={true}
        // style={{ width: '60vw', height: '40vh' }}
      />
    </div>
  )
}

function LottieBirds() {
  return (
    <div style={{
      position: 'absolute',
      width: '100vw',
      height: '100vh',
      zIndex: 3,
      pointerEvents: 'none',
    }}>
      <Lottie
        animationData={birdAnimation}
        loop={true}
      />
    </div>
  )
}

function LottieBirdsDark() {
  return (
    <div style={{
      position: 'absolute',
      width: '100vw',
      height: '100vh',
      zIndex: 10,
      pointerEvents: 'none',
    }}>
      <Lottie
        animationData={birdDarkAnimation}
        loop={true}
      />
    </div>
  )
}

function NightStars() {
  // 40 stars, random position, size, and type
  const stars = Array.from({ length: 40 }).map((_, i) => {
    const left = Math.random() * 95;
    const top = Math.random() * 45 + 5; // 5vh to 50vh
    const size = Math.random() * 4 + 3; // 3px to 7px
    const isBlurry = Math.random() < 0.4;
    const isShiny = !isBlurry && Math.random() < 0.5;
    return { id: i, left, top, size, isBlurry, isShiny };
  });
  return (
    <>
      {stars.map(star => (
        <div
          key={star.id}
          className={`star${star.isBlurry ? ' star-blur' : ''}${star.isShiny ? ' star-shiny' : ''}`}
          style={{
            left: `${star.left}vw`,
            top: `${star.top}vh`,
            width: star.size,
            height: star.size,
            opacity: star.isBlurry ? 0.45 : star.isShiny ? 1 : 0.8,
            filter: star.isBlurry ? 'blur(2.5px)' : star.isShiny ? 'drop-shadow(0 0 8px #fff)' : 'none',
            background: star.isShiny ? 'linear-gradient(90deg, #fff 60%, #ffe 100%)' : '#fff',
            position: 'absolute',
            borderRadius: '50%',
            zIndex: 2,
            animation: 'star-twinkle 2s infinite alternate',
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </>
  );
}

function AnimatedWeather({ timeOfDay, weatherCode }) {
  const isRain = weatherCode && ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(weatherCode))
  const isDrizzle = weatherCode === 3
  const isSnow = weatherCode && ([71,73,75,77,85,86].includes(weatherCode))
  const isFog = weatherCode && ([45,48].includes(weatherCode))
  const isThunder = weatherCode && ([95,96,99].includes(weatherCode))
  const isCloudy = weatherCode && ([2,3,45,48,51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99].includes(weatherCode))
  const showRainbow = isRain && timeOfDay !== 'night'
  const darkSky = isDrizzle || isRain

  return (
    <div className={`weather-anim${darkSky ? ' dark-sky' : ''}`}>
      {/* Sun/Moon/Stars with animated position */}
      {timeOfDay === 'morning' && <div className="sun morning-sun" style={getSunPosition()} />}
      {timeOfDay === 'afternoon' && <div className="sun afternoon-sun" style={getSunPosition()} />}
      {timeOfDay === 'evening' && <div className="sunset" style={getSunPosition()} />}
      {timeOfDay === 'night' && <><CrescentMoon />
        <NightStars />
        <ShootingStar />
      </>}
      {/* Birds (Lottie) */}
      {(timeOfDay === 'morning' || timeOfDay === 'afternoon') && <LottieBirds />}
      {timeOfDay === 'night' && <LottieBirdsDark />}
      {/* Rainbow */}
      <Rainbow show={showRainbow} />
      {/* Lottie Clouds */}
      {(isCloudy || timeOfDay === 'morning' || timeOfDay === 'afternoon' || timeOfDay === 'evening') && <LottieClouds />}
      {/* Dynamic Clouds (optional: keep for extra depth) */}
      {/* {(isCloudy || timeOfDay === 'morning' || timeOfDay === 'afternoon' || timeOfDay === 'evening') && <DynamicClouds timeOfDay={timeOfDay} isCloudy={isCloudy} />} */}
      {/* Rain or Drizzle */}
      {isRain && <Rain drizzle={false} />}
      {isDrizzle && <Rain drizzle={true} />}
      {/* Snow */}
      {isSnow && <Snow />}
      {/* Fog */}
      {isFog && <Fog />}
      {/* Lightning (thunderstorm) */}
      {isThunder && <Lightning />}
    </div>
  )
}

export default AnimatedWeather 