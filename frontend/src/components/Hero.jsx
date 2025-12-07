import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaArrowDown } from 'react-icons/fa'
import { VectorPattern } from './VectorPattern'
import './Hero.css'

const Hero = ({ onRegisterClick }) => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false, hackathonStarted: false })

  useEffect(() => {
    // Hackathon start date: 9 PM January 16th, 2026
    const hackathonStartDate = new Date('2026-01-16T21:00:00')
    
    // Calculate next Sunday at 9 AM (after hackathon starts)
    const getNextSunday9AM = () => {
      const now = new Date()
      const nextSunday = new Date(now)
      // Get current day of week (0 = Sunday, 6 = Saturday)
      const dayOfWeek = now.getDay()
      const currentHour = now.getHours()
      const currentMinutes = now.getMinutes()
      
      // If it's Sunday and before 9 AM, target today at 9 AM
      // Otherwise, calculate days until next Sunday
      let daysUntilSunday
      if (dayOfWeek === 0 && (currentHour < 9 || (currentHour === 9 && currentMinutes === 0))) {
        daysUntilSunday = 0
      } else {
        daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek
      }
      
      nextSunday.setDate(now.getDate() + daysUntilSunday)
      nextSunday.setHours(9, 0, 0, 0)
      return nextSunday
    }

    const updateCountdown = () => {
      const currentTime = new Date().getTime()
      const hackathonStartTime = hackathonStartDate.getTime()
      
      // Check if hackathon has started
      if (currentTime >= hackathonStartTime) {
        // Hackathon has started - countdown to Sunday 9 AM
        const sundayTarget = getNextSunday9AM()
        const difference = sundayTarget.getTime() - currentTime

        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setCountdown({ days, hours, minutes, seconds, expired: false, hackathonStarted: true })
      } else {
        // Hackathon hasn't started yet - countdown to hackathon start
        const difference = hackathonStartTime - currentTime

        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setCountdown({ days, hours, minutes, seconds, expired: false, hackathonStarted: false })
      }
    }

    // Update immediately
    updateCountdown()

    // Update every second
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleRegisterClick = () => {
    if (onRegisterClick) {
      onRegisterClick()
    }
  }

  const handleLearnMoreClick = () => {
    const aboutSection = document.querySelector('#about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Animation variants (reduced by 70%)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.09,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section id="home" className="hero" ref={sectionRef}>
      {/* Background Container - Ready for imported SVG assets */}
      <div className="hero-background">
        <VectorPattern vectors={['vector01', 'vector03']} size="small" opacity={0.12} />
      </div>

      {/* Main Content */}
      <motion.div
        className="hero-container"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <div className="hero-content">
          {/* Badge */}
          <motion.div
            className="hero-badge"
            variants={itemVariants}
          >
            <span className="badge-pulse"></span>
            <span className="badge-text">Join us for an incredible 36-hour journey</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="hero-title"
            variants={titleVariants}
          >
            <span className="title-line">Hack the</span>
            <span className="title-accent">
              <span className="title-bias-text-wrapper">
                <span className="title-bias-text">Bias</span>
              </span>
            </span>
          </motion.h1>

          {/* Countdown Timer */}
          <div className="hero-countdown">
            {countdown.hackathonStarted ? (
              <>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.9em', opacity: 0.9 }}>
                  Countdown to 9 AM on Sunday
                </div>
                <div>
                  {String(countdown.days).padStart(2, '0')}d • {String(countdown.hours).padStart(2, '0')}h • {String(countdown.minutes).padStart(2, '0')}m • {String(countdown.seconds).padStart(2, '0')}s
                </div>
              </>
            ) : (
              `${String(countdown.days).padStart(2, '0')}d • ${String(countdown.hours).padStart(2, '0')}h • ${String(countdown.minutes).padStart(2, '0')}m • ${String(countdown.seconds).padStart(2, '0')}s`
            )}
          </div>

          {/* Subtitle */}
          <motion.p
            className="hero-subtitle"
            variants={itemVariants}
          >
            Hack the Bias is a student-run initiative of Robogals UCalgary that challenges developers, designers, and dreamers to build tech for social justice, inclusion, and equity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="hero-cta"
            variants={itemVariants}
          >
            <motion.button
              className="btn-primary"
              onClick={handleRegisterClick}
              whileHover={{ scale: 1.02, y: -1, boxShadow: '0 12px 30px rgba(33, 150, 243, 0.3)' }}
              whileTap={{ scale: 0.99 }}
            >
              <span>Pre Register</span>
              <motion.span
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
              </motion.span>
            </motion.button>

            <motion.button
              className="btn-secondary"
              onClick={handleLearnMoreClick}
              whileHover={{ scale: 1.02, y: -1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              whileTap={{ scale: 0.99 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Curved Wave Separator */}
      <div className="hero-wave-separator">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,120L48,110C96,100,192,80,288,70C384,60,480,60,576,65C672,70,768,80,864,85C960,90,1056,90,1152,85C1248,80,1344,70,1392,65L1440,60L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="#BCEAF8"
          />
        </svg>
      </div>
    </section>
  )
}

export default Hero
