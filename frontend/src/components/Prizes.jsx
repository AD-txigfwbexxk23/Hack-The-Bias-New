import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaTrophy, FaMedal, FaGift, FaAward } from 'react-icons/fa'
import { BackgroundElements } from './BackgroundElements'
import { VectorPattern } from './VectorPattern'
import './Prizes.css'

const Prizes = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const regularPrizes = [
    {
      rank: '1st',
      title: '1st Place',
      amount: 'Amount TBD',
      icon: FaTrophy,
      color: '#FFD700',
      gradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
    },
    {
      rank: '2nd',
      title: '2nd Place',
      amount: 'Amount TBD',
      icon: FaMedal,
      color: '#C0C0C0',
      gradient: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)',
    },
    {
      rank: '3rd',
      title: '3rd Place',
      amount: 'Amount TBD',
      icon: FaAward,
      color: '#CD7F32',
      gradient: 'linear-gradient(135deg, #CD7F32, #8B6914)',
    },
  ]

  const beginnerPrizes = [
    {
      rank: '1st',
      title: '1st Place',
      amount: 'Amount TBD',
      icon: FaTrophy,
      color: '#FFD700',
      gradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
    },
    {
      rank: '2nd',
      title: '2nd Place',
      amount: 'Amount TBD',
      icon: FaMedal,
      color: '#C0C0C0',
      gradient: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)',
    },
  ]

  const sidePrize = {
    title: 'KPMG Challenge',
    amount: 'Amount TBD',
    icon: FaGift,
    color: '#00338D',
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section id="prizes" className="prizes" ref={ref}>
      {/* Background Elements */}
      <div className="prizes-background">
        <BackgroundElements sectionRef={ref} />
        <VectorPattern vectors={['vector02']} size="small" opacity={0.1} />
      </div>

      <div className="prizes-container">
        {/* Header */}
        <motion.div
          className="prizes-header"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">
            Compete for <span className="title-accent">Amazing</span> Prizes
          </h2>

        </motion.div>

        {/* Regular Tier Prizes */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3 className="categories-title" style={{ marginBottom: '2rem', textAlign: 'center' }}>Regular Tier</h3>
          <motion.div
            className="main-prizes"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {regularPrizes.map((prize, index) => {
              const Icon = prize.icon
              return (
                <motion.div
                  key={prize.rank}
                  className={`prize-card prize-${prize.rank.toLowerCase()}`}
                  variants={itemVariants}
                  whileHover={{ y: -12, scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="prize-badge"
                    style={{ background: prize.gradient }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  >
                    {prize.rank} Place
                  </motion.div>
                  <div className="prize-icon-wrapper" style={{ background: prize.gradient }}>
                    <Icon />
                  </div>
                  <h3 className="prize-title">{prize.title}</h3>
                  <div className="prize-amount" style={{ color: prize.color }}>
                    {prize.amount}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>

        {/* Beginner Tier Prizes */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ marginTop: '3rem' }}
        >
          <h3 className="categories-title" style={{ marginBottom: '2rem', textAlign: 'center' }}>Beginner Tier</h3>
          <motion.div
            className="main-prizes"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {beginnerPrizes.map((prize, index) => {
              const Icon = prize.icon
              return (
                <motion.div
                  key={`beginner-${prize.rank}`}
                  className={`prize-card prize-${prize.rank.toLowerCase()}`}
                  variants={itemVariants}
                  whileHover={{ y: -12, scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="prize-badge"
                    style={{ background: prize.gradient }}
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  >
                    {prize.rank} Place
                  </motion.div>
                  <div className="prize-icon-wrapper" style={{ background: prize.gradient }}>
                    <Icon />
                  </div>
                  <h3 className="prize-title">{prize.title}</h3>
                  <div className="prize-amount" style={{ color: prize.color }}>
                    {prize.amount}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>

        {/* Sponsor Challenges */}
        <motion.div
          className="categories-section"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="categories-title">Sponsor Challenges</h3>
          <div className="categories-grid" style={{ justifyContent: 'center' }}>
            <motion.div
              className="category-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.25 }}
              whileHover={{ y: -8, scale: 1.05 }}
            >
              <div
                className="category-icon"
                style={{ background: sidePrize.color, color: '#FFFFFF' }}
              >
                {(() => {
                  const Icon = sidePrize.icon
                  return <Icon />
                })()}
              </div>
              <h4 className="category-title">{sidePrize.title}</h4>
              <div className="category-amount" style={{ color: sidePrize.color }}>
                {sidePrize.amount}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Additional Benefits */}
        <motion.div
          className="benefits-section"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 className="benefits-title">Additional Benefits for All Participants</h3>
          <div className="benefits-grid">
            {[
              'Access to exclusive workshops',
              'Networking with industry leaders',
              'Career mentorship opportunities',
              'Free meals and refreshments',
            ].map((benefit, index) => (
              <motion.div
                key={benefit}
                className="benefit-item"
                      initial={{ opacity: 0, x: -8 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.3, delay: 0.35 + index * 0.02 }}
                whileHover={{ x: 5, scale: 1.02 }}
              >
                <FaGift className="benefit-icon" />
                {benefit}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Prizes
