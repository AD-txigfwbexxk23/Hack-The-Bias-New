import { motion } from 'framer-motion'
import Vector3 from './Vector 3.svg'
import Vector01 from './Vector 01.svg'
import Vector02 from './Vector 02.svg'

export const VectorPattern = ({ size = 'small', opacity = 0.08 }) => {
  const vectorMap = [Vector3, Vector01, Vector02]

  const sizeMap = {
    small: 120,
    medium: 180,
    large: 240,
  }

  const dimensions = sizeMap[size] || sizeMap.small

  // Positions only on left and right edges
  const positions = [
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
            opacity,
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