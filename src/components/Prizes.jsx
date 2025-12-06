import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaTrophy, FaMedal, FaGift, FaAward, FaStar, FaHeart, FaLightbulb, FaPalette, FaUsers } from 'react-icons/fa'
import { BackgroundElements } from './BackgroundElements'
import { VectorPattern } from './VectorPattern'
import './Prizes.css'

const Prizes = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const prizes = [
    {
      rank: '1st',
      title: 'Grand Prize',
      amount: '$10,000',
      icon: FaTrophy,
      color: '#FFD700',
      description: 'The ultimate recognition for innovation and impact. Plus mentorship opportunities and featured spotlight.',
      features: [
        '$10,000 Cash Prize',
        '1-on-1 Mentorship Session',
        'Featured on Website & Social',
        'Interview Opportunities',
      ],
      gradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
    },
    {
      rank: '2nd',
      title: 'Runner-Up',
      amount: '$5,000',
      icon: FaMedal,
      color: '#C0C0C0',
      description: 'Outstanding execution and creativity. Excellent work that deserves recognition.',
      features: [
        '$5,000 Cash Prize',
        'Mentorship Opportunities',
        'Social Media Feature',
        'Interview Opportunities',
      ],
      gradient: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)',
    },
    {
      rank: '3rd',
      title: 'Third Place',
      amount: '$3,000',
      icon: FaAward,
      color: '#CD7F32',
      description: 'Impressive innovation and technical excellence. Great work by the team!',
      features: [
        '$3,000 Cash Prize',
        'Mentorship Session',
        'Social Media Shoutout',
      ],
      gradient: 'linear-gradient(135deg, #CD7F32, #8B6914)',
    },
  ]

  const categories = [
    {
      title: 'Best Diversity Impact',
      amount: '$2,500',
      icon: FaHeart,
      description: 'Solution that best addresses diversity and inclusion challenges.',
      color: '#2196F3',
    },
    {
      title: 'Most Innovative',
      amount: '$2,500',
      icon: FaLightbulb,
      description: 'Most creative and innovative approach to problem-solving.',
      color: '#1976D2',
    },
    {
      title: 'Best Design',
      amount: '$2,000',
      icon: FaPalette,
      description: 'Exceptional UI/UX design and user experience.',
      color: '#9C27B0',
    },
    {
      title: 'People\'s Choice',
      amount: '$1,500',
      icon: FaUsers,
      description: 'Voted favorite by all participants and attendees.',
      color: '#E91E63',
    },
  ]

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
          <span className="section-badge">Prizes</span>
          <h2 className="section-title">
            Compete for <span className="title-accent">$50,000+</span> in Prizes
          </h2>
          <p className="section-description">
            Incredible rewards await the most innovative solutions. Compete for cash prizes, mentorship
            opportunities, and recognition that can launch your career.
          </p>
        </motion.div>

        {/* Main Prizes */}
        <motion.div
          className="main-prizes"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {prizes.map((prize, index) => {
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
                <p className="prize-description">{prize.description}</p>
                <ul className="prize-features">
                  {prize.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 + idx * 0.05 }}
                    >
                      <FaStar className="feature-icon" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Category Prizes */}
        <motion.div
          className="categories-section"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="categories-title">Special Category Awards</h3>
          <div className="categories-grid">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.title}
                  className="category-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                >
                  <div
                    className="category-icon"
                    style={{ background: category.color, color: '#FFFFFF' }}
                  >
                    <Icon />
                  </div>
                  <h4 className="category-title">{category.title}</h4>
                  <div className="category-amount" style={{ color: category.color }}>
                    {category.amount}
                  </div>
                  <p className="category-description">{category.description}</p>
                </motion.div>
              )
            })}
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
              'Swag bag with premium items',
              'Free meals and refreshments',
              'Certificate of participation',
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
