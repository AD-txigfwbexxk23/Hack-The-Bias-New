import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaUsers, FaBullhorn, FaTrophy, FaGraduationCap } from 'react-icons/fa'
import { BackgroundElements } from './BackgroundElements'
import { VectorPattern } from './VectorPattern'
import KPMGLogo from './KMPG.png'
import ArcurveLogo from './Arcurve.png'
import './Sponsors.css'

const Sponsors = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const allSponsors = [
    { name: 'KPMG', logo: KPMGLogo },
    { name: 'Arcurve', logo: ArcurveLogo },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section id="sponsors" className="sponsors" ref={ref}>
      {/* Background Elements */}
      <div className="sponsors-background">
        <BackgroundElements sectionRef={ref} />
        <VectorPattern vectors={['vector01']} size="small" opacity={0.1} />
      </div>

      <div className="sponsors-container">
        {/* Header */}
        <motion.div
          className="sponsors-header"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">
            <span className="title-our">Our</span>{' '}
            <span className="title-amazing">Amazing</span>{' '}
            <span className="title-sponsors">Sponsors</span>
          </h2>
          <span className="section-badge">Sponsors</span>
          <p className="section-description">
            We're grateful to our sponsors and partners who make this event possible. Their support
            enables us to create an incredible experience for all participants and award meaningful prizes.
          </p>
        </motion.div>

        {/* Sponsors Grid */}
        <motion.div
          className="sponsors-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {allSponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              className="sponsor-card"
              data-sponsor={sponsor.name}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="sponsor-logo">
                <img src={sponsor.logo} alt={`${sponsor.name} logo`} />
              </div>
              <h4 className="sponsor-name">{sponsor.name}</h4>
            </motion.div>
          ))}
        </motion.div>

        {/* Why Sponsor Section */}
        <motion.div
          className="why-sponsor-section"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="why-sponsor-title">Why Sponsor Hack the Bias?</h3>
          <p className="why-sponsor-subtitle">
            An initiative by Robogals UCalgary, building on partnerships with industry leaders
          </p>
          
          <div className="why-sponsor-cards">
            {[
              {
                icon: FaUsers,
                title: 'Top Diverse Talent',
                description: 'Our hackathon attracts a highly motivated and diverse group of university students, with varying educational experiences and individual strengths. Gain early access to innovative thinkers and future leaders.',
                button: '69% first-time hackers',
              },
              {
                icon: FaBullhorn,
                title: 'Amplify Your Brand',
                description: 'Engage directly with participants, mentors, and industry leaders through speaking opportunities, branded challenges, and booths. Position your organization at the forefront of tech innovation.',
                button: 'High brand visibility',
              },
              {
                icon: FaTrophy,
                title: 'Showcase Social Impact',
                description: 'Your sponsorship highlights your role as a socially responsible leader dedicated to fostering innovation that drives real-world change and creates equitable opportunities.',
                button: 'Real-world impact',
              },
            ].map((card, index) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  className="why-sponsor-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="why-sponsor-icon">
                    <Icon />
                  </div>
                  <h4 className="why-sponsor-card-title">{card.title}</h4>
                  <p className="why-sponsor-card-description">{card.description}</p>
                  <div className="why-sponsor-button">{card.button}</div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Where Your Support Goes Section */}
        <motion.div
          className="support-goes-section"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="support-goes-title">Where Your Support Goes</h3>
          
          <div className="support-goes-content">
            <div className="support-goes-text">
              <p>
                Your sponsorship directly fuels the success of Hack the Bias. Funds are allocated to cover essential event logistics such as venue booking and internal operations.
              </p>
              <p>
                A significant portion goes toward creating an unforgettable experience for participants, including engaging educational workshops, fun activities, high-quality meals, impactful marketing, and exciting prizes.
              </p>
            </div>
            
            <div className="support-goes-card">
              <div className="support-goes-card-icon">
                <FaGraduationCap />
              </div>
              <h4 className="support-goes-card-title">Promoting Equity & Accessibility</h4>
              <p className="support-goes-card-description">
                We're designing multiple tracks tailored to different experience levels, ensuring both beginners and advanced hackers feel supported, challenged, and empowered.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Become a Sponsor CTA */}
        <motion.div
          className="sponsor-cta"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="cta-content">
            <h3 className="cta-title">Interested in Sponsoring?</h3>
            <p className="cta-description">
              Join us in empowering diversity and inclusion in tech. Contact us to learn about
              sponsorship opportunities and packages.
            </p>
            <motion.a
              href="/HackTheBias_2026_Sponsorship_Package.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              View Sponsorship Package
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Sponsors
