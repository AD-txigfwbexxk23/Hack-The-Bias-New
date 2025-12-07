import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaLightbulb, FaHeart, FaClock, FaCalendarAlt, FaUsers, FaBrain, FaRocket } from 'react-icons/fa'
import { BackgroundElements } from './BackgroundElements'
import { VectorPattern } from './VectorPattern'
import './About.css'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })


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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section id="about" className="about" ref={ref}>
      {/* Background Elements */}
      <div className="about-background">
        <BackgroundElements sectionRef={ref} />
        <VectorPattern vectors={['vector3', 'vector01']} size="small" opacity={0.1} />
      </div>

      <div className="about-container">
        {/* Header */}
        <motion.div
          className="about-header"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">
            About Hack the Bias
          </h2>
          <div className="about-description-container">
            <p className="section-description">
              Hack the Bias is a community-powered hackathon created for students, technologists, and activists who want to build solutions that tackle real-world issues. From racial justice to accessibility, our mission is to inspire innovation that amplifies underrepresented voices and drives positive change.
            </p>
            <p className="section-description">
              Whether you're a developer, designer, storyteller, or strategist — there's a place for you here. Collaborate, learn, and launch meaningful ideas into the world.
            </p>
          </div>
        </motion.div>

        {/* How it Works */}
        <motion.div
          className="how-it-works-section"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <div className="how-it-works-container">
            <motion.h3
              className="how-it-works-title"
              variants={itemVariants}
            >
              How it Works
            </motion.h3>
            <motion.p
              className="how-it-works-subtitle"
              variants={itemVariants}
            >
              From idea to impact — here's what your Hack the Bias journey looks like:
            </motion.p>
            
            <div className="how-it-works-steps">
              {[
              {
                number: 1,
                icon: FaLightbulb,
                title: 'Pick a Challenge',
                description: 'Choose from a list of curated prompts focused on justice, equity, health, and accessibility.',
                iconBg: '#FAF8D1',
                iconBorder: '#B7C4FC',
              },
              {
                number: 2,
                icon: FaUsers,
                title: 'Form a Team',
                description: 'Collaborate with passionate hackers, designers, and changemakers to brainstorm bold solutions.',
                iconBg: '#BCEAF8',
                iconBorder: '#FAF8D1',
              },
              {
                number: 3,
                icon: FaRocket,
                title: 'Build & Launch',
                description: 'Turn your idea into reality in 36 hours. Present your project to judges and make your impact.',
                iconBg: '#F7D8F6',
                iconBorder: '#BCEAF8',
              },
            ].map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  className="how-it-works-step"
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="step-icon-wrapper" style={{ backgroundColor: step.iconBg, borderColor: step.iconBorder }}>
                    <Icon className="step-icon" />
                    <div className="step-number-badge">{step.number}</div>
                  </div>
                  <h4 className="step-title">{step.title}</h4>
                  <p className="step-description">{step.description}</p>
                </motion.div>
              )
            })}
            </div>
          </div>
        </motion.div>

        {/* Event at a Glance */}
        <motion.div
          className="event-glance-section"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.h3
            className="event-glance-title"
            variants={itemVariants}
          >
            Event at a Glance
          </motion.h3>
          <div className="event-glance-grid">
            {[
              {
                icon: FaClock,
                value: '36 Hours, In Person @ UCalgary',
                label: 'EVENT',
                bgColor: '#153166',
                iconColor: '#FFFFFF',
                textColor: '#FFFFFF',
                labelColor: '#FFFFFF',
                iconPosition: 'top-right',
              },
              {
                icon: FaCalendarAlt,
                value: 'January 16th- 18th, 2026',
                label: 'DATE',
                bgColor: '#B7C4FC',
                iconColor: '#153166',
                textColor: '#153166',
                labelColor: '#6C757D',
                iconPosition: 'top-left',
              },
              {
                icon: FaUsers,
                value: 'University + High School Students',
                label: 'PARTICIPANTS',
                bgColor: '#FFFFFF',
                iconColor: '#153166',
                textColor: '#153166',
                labelColor: '#6C757D',
                iconPosition: 'top-left',
              },
              {
                icon: FaBrain,
                value: 'Systemic Bias, Equity, Inclusion',
                label: 'FOCUS',
                bgColor: '#F7D8F6',
                iconColor: '#FFFFFF',
                textColor: '#153166',
                labelColor: '#6C757D',
                iconPosition: 'top-left',
              },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.label}
                  className={`event-glance-item event-glance-item-${index + 1}`}
                  style={{ backgroundColor: item.bgColor }}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`event-glance-icon event-glance-icon-${item.iconPosition}`} style={{ color: item.iconColor }}>
                    <Icon />
                  </div>
                  <div className="event-glance-value" style={{ color: item.textColor }}>
                    {item.value}
                  </div>
                  <div className="event-glance-label" style={{ color: item.labelColor }}>
                    {item.label}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Stats */}

      </div>
    </section>
  )
}

export default About
