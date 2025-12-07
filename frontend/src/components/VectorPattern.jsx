import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Vector3 from './Vector 3.svg'
import Vector01 from './Vector 01.svg'
import Vector02 from './Vector 02.svg'

export const VectorPattern = ({ size = 'small', opacity = 0.08 }) => {
  const vectorMap = [Vector3, Vector01, Vector02]
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const sizeMap = {
    small: 120,
    medium: 180,
    large: 240,
  }

  const dimensions = isMobile ? sizeMap[size] * 0.6 : sizeMap[size] || sizeMap.small

  // Desktop positions - more vectors
  const desktopPositions = [
    { top: '8%', left: '5%', rotate: Math.random() * 40 - 20, vector: 0 },
    { top: '15%', left: '88%', rotate: Math.random() * 40 - 20, vector: 1 },
    { top: '28%', left: '3%', rotate: Math.random() * 40 - 20, vector: 2 },
    { top: '35%', left: '92%', rotate: Math.random() * 40 - 20, vector: 0 },
    { top: '48%', left: '8%', rotate: Math.random() * 40 - 20, vector: 1 },
    { top: '55%', left: '90%', rotate: Math.random() * 40 - 20, vector: 2 },
    { top: '68%', left: '4%', rotate: Math.random() * 40 - 20, vector: 0 },
    { top: '75%', left: '87%', rotate: Math.random() * 40 - 20, vector: 1 },
    { top: '88%', left: '6%', rotate: Math.random() * 40 - 20, vector: 2 },
  ]

  // Mobile positions - fewer, more spaced out vectors
  const mobilePositions = [
    { top: '12%', left: '5%', rotate: Math.random() * 30 - 15, vector: 0 },
    { top: '25%', left: '88%', rotate: Math.random() * 30 - 15, vector: 1 },
    { top: '50%', left: '3%', rotate: Math.random() * 30 - 15, vector: 2 },
    { top: '75%', left: '90%', rotate: Math.random() * 30 - 15, vector: 0 },
    { top: '90%', left: '6%', rotate: Math.random() * 30 - 15, vector: 1 },
  ]

  const positions = isMobile ? mobilePositions : desktopPositions
  const finalOpacity = isMobile ? opacity * 0.6 : opacity

  return (
    <div
      className="vector-pattern-container"
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      {positions.map((pos, i) => (
        <motion.img
          key={i}
          src={vectorMap[pos.vector]}
          alt=""
          style={{
            position: 'absolute',
            width: `${dimensions}px`,
            height: 'auto',
            opacity: finalOpacity,
            top: pos.top,
            left: pos.left,
            transform: `rotate(${pos.rotate}deg)`,
            pointerEvents: 'none',
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6 + (i % 3),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  )
}