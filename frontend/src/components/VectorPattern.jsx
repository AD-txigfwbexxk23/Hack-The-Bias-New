import { motion } from 'framer-motion'
import Vector3 from './Vector 3.svg'
import Vector01 from './Vector 01.svg'
import Vector02 from './Vector 02.svg'

export const VectorPattern = ({ vectors = ['vector3'], size = 'small', opacity = 0.08 }) => {
  const vectorMap = {
    vector3: Vector3,
    vector01: Vector01,
    vector02: Vector02,
  }

  const sizeMap = {
    small: { width: 120, height: 120 },
    medium: { width: 180, height: 180 },
    large: { width: 240, height: 240 },
  }

  const dimensions = sizeMap[size] || sizeMap.small

  // Create a grid pattern with multiple instances
  const patternPositions = [
    { top: '10%', left: '5%', rotate: -15, delay: 0 },
    { top: '15%', right: '8%', rotate: 20, delay: 0.5 },
    { bottom: '20%', left: '12%', rotate: -25, delay: 1 },
    { bottom: '15%', right: '10%', rotate: 30, delay: 1.5 },
    { top: '50%', left: '3%', rotate: 10, delay: 2 },
    { top: '45%', right: '5%', rotate: -20, delay: 2.5 },
    { bottom: '30%', left: '8%', rotate: 15, delay: 3 },
    { bottom: '25%', right: '7%', rotate: -18, delay: 3.5 },
  ]

  return (
    <div className="vector-pattern-container">
      {vectors.map((vectorName, vectorIndex) => {
        const vectorSrc = vectorMap[vectorName] || Vector3
        return patternPositions.map((pos, index) => {
          const globalIndex = vectorIndex * patternPositions.length + index
          return (
            <motion.img
              key={`${vectorName}-${index}`}
              src={vectorSrc}
              alt=""
              className="vector-pattern-item"
              style={{
                position: 'absolute',
                width: `${dimensions.width}px`,
                height: 'auto',
                opacity: opacity,
                top: pos.top,
                bottom: pos.bottom,
                left: pos.left,
                right: pos.right,
                transform: `rotate(${pos.rotate}deg)`,
                zIndex: 1,
                pointerEvents: 'none',
              }}
              animate={{
                y: [0, -15, 0],
                rotate: [pos.rotate, pos.rotate + 3, pos.rotate],
                opacity: [opacity, opacity * 1.3, opacity],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 8 + index * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: pos.delay + globalIndex * 0.2,
              }}
            />
          )
        })
      })}
    </div>
  )
}

