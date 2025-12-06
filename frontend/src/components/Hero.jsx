import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaArrowDown, FaRocket, FaUsers, FaTrophy } from 'react-icons/fa'
import { VectorPattern } from './VectorPattern'
import './Hero.css'

const Hero = ({ onRegisterClick }) => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false })

  const stats = [
    { icon: FaUsers, value: '500+', label: 'Participants' },
    { icon: FaTrophy, value: '$50K+', label: 'In Prizes' },
    { icon: FaRocket, value: '48h', label: 'To Build' },
  ]

  useEffect(() => {
    // Set target date to be 58 days, 20 hours, 21 minutes, 2 seconds from now
    const now = new Date()
    const targetDate = new Date(now.getTime())
    targetDate.setDate(targetDate.getDate() + 58)
    targetDate.setHours(targetDate.getHours() + 20)
    targetDate.setMinutes(targetDate.getMinutes() + 21)
    targetDate.setSeconds(targetDate.getSeconds() + 2)

    const updateCountdown = () => {
      const currentTime = new Date().getTime()
      const difference = targetDate.getTime() - currentTime

      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true })
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds, expired: false })
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
        <VectorPattern vectors={['vector01']} size="small" opacity={0.12} />
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
            <span className="badge-text">Join us for an incredible 48-hour journey</span>
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
            {countdown.expired ? (
              'The hackathon has begun!'
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
                <FaArrowDown style={{ transform: 'rotate(-90deg)' }} />
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

          {/* Stats */}
          <motion.div
            className="hero-stats"
            variants={itemVariants}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  className="stat-card"
              initial={{ opacity: 0, scale: 0.98, y: 4 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.03, y: -3 }}
                >
                  <div className="stat-icon">
                    <Icon />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </motion.div>
              )
            })}
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
