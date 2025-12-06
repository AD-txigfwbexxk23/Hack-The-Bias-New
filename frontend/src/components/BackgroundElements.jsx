import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'

// SVG Gear Component - Hero Version (crisp white, bold strokes)
export const GearSVG = ({ size = 200, className = '', opacity = 1, hero = false }) => {
  if (hero) {
    // Hero version: pure white, bold strokes, no opacity/blur
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className={className}
        style={{ filter: 'none', opacity: 1 }}
      >
        <g stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Outer gear ring */}
          <circle cx="100" cy="100" r="45" />
          {/* Inner hub */}
          <circle cx="100" cy="100" r="22" />
          {/* Gear teeth */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30) * Math.PI / 180
            const x1 = 100 + Math.cos(angle) * 50
            const y1 = 100 + Math.sin(angle) * 50
            const x2 = 100 + Math.cos(angle) * 68
            const y2 = 100 + Math.sin(angle) * 68
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth="2.5"
              />
            )
          })}
          {/* Center cross */}
          <line x1="100" y1="75" x2="100" y2="125" strokeWidth="2" />
          <line x1="75" y1="100" x2="125" y2="100" strokeWidth="2" />
        </g>
      </svg>
    )
  }
  
  // Original version for other sections
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      style={{ opacity, filter: 'none' }}
    >
      <defs>
        <linearGradient id={`gearGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E3F2FD" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#BBDEFB" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <g stroke="#FFFFFF" strokeWidth="1.5" fill="none">
        <circle cx="100" cy="100" r="40" fill="none" stroke="#E3F2FD" strokeWidth="2" />
        <circle cx="100" cy="100" r="25" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * Math.PI / 180
          const x1 = 100 + Math.cos(angle) * 55
          const y1 = 100 + Math.sin(angle) * 55
          return (
            <rect
              key={i}
              x={x1 - 5}
              y={y1 - 5}
              width="10"
              height="25"
              fill="none"
              stroke="#E3F2FD"
              strokeWidth="1.5"
              transform={`rotate(${i * 30} ${x1} ${y1})`}
            />
          )
        })}
      </g>
    </svg>
  )
}

// Circuit Line Component - Hero Version (crisp white, bold strokes)
export const CircuitLine = ({ path, className = '', opacity = 1, hero = false }) => {
  if (hero) {
    // Hero version: pure white, bold strokes, no opacity/blur
    return (
      <svg
        className={className}
        width="100%"
        height="100%"
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        style={{ filter: 'none', opacity: 1 }}
      >
        <g stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d={path}
            strokeWidth="2.5"
          />
          {/* Circuit nodes - pure white */}
          <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
          <circle cx="350" cy="250" r="4" fill="#FFFFFF" />
          <circle cx="200" cy="150" r="4" fill="#FFFFFF" />
          {/* Additional connection points */}
          <circle cx="150" cy="100" r="3" fill="#FFFFFF" />
          <circle cx="250" cy="200" r="3" fill="#FFFFFF" />
        </g>
      </svg>
    )
  }
  
  // Original version for other sections
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 400 300"
      preserveAspectRatio="none"
      style={{ opacity, filter: 'none' }}
    >
      <defs>
        <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E3F2FD" stopOpacity="1" />
          <stop offset="50%" stopColor="#BBDEFB" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path
        d={path}
        stroke="#E3F2FD"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <circle cx="50" cy="50" r="3" fill="#FFFFFF" opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="8s" repeatCount="indefinite" />
      </circle>
      <circle cx="350" cy="250" r="3" fill="#FFFFFF" opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="8s" begin="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="150" r="3" fill="#FFFFFF" opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="8s" begin="4s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

// Reusable Background Elements Component
export const BackgroundElements = ({ sectionRef }) => {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  const gear1Y = useTransform(scrollYProgress, [0, 1], [0, 12])
  const gear2Y = useTransform(scrollYProgress, [0, 1], [0, -16])
  const gear3Y = useTransform(scrollYProgress, [0, 1], [0, 10])
  const circuitY = useTransform(scrollYProgress, [0, 1], [0, 6])

  const springConfig = { stiffness: 50, damping: 30 }
  const smoothGear1Y = useSpring(gear1Y, springConfig)
  const smoothGear2Y = useSpring(gear2Y, springConfig)
  const smoothGear3Y = useSpring(gear3Y, springConfig)
  const smoothCircuitY = useSpring(circuitY, springConfig)

  return (
    <>
      {/* Gears */}
      <motion.div
        className="bg-gear bg-gear-1"
        style={{ y: smoothGear1Y }}
      >
        <GearSVG size={300} opacity={0.25} />
      </motion.div>

      <motion.div
        className="bg-gear bg-gear-2"
        style={{ y: smoothGear2Y }}
      >
        <GearSVG size={280} opacity={0.25} />
      </motion.div>

      <motion.div
        className="bg-gear bg-gear-3"
        style={{ y: smoothGear3Y }}
      >
        <GearSVG size={260} opacity={0.25} />
      </motion.div>

      {/* Circuit Lines */}
      <motion.div
        className="bg-circuit bg-circuit-1"
        style={{ y: smoothCircuitY }}
      >
        <CircuitLine path="M 50 50 Q 150 100 200 150 T 350 250" opacity={0.2} />
      </motion.div>

      <motion.div
        className="bg-circuit bg-circuit-2"
      >
        <CircuitLine path="M 100 200 Q 200 100 300 150 Q 350 180 380 220" opacity={0.2} />
      </motion.div>
    </>
  )
}

