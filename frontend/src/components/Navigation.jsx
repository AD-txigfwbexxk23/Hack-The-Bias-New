import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUser, FaSignOutAlt, FaUserShield } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import Vector3 from './Vector 3.svg'
import './Navigation.css'

const Navigation = ({ scrollY, onRegisterClick, onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, registration, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Always show scrolled (blue) state on non-home pages
    if (location.pathname !== '/') {
      setIsScrolled(true)
    } else {
      setIsScrolled(scrollY > 50)
    }
  }, [scrollY, location.pathname])

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Prizes', href: '#prizes' },
    { name: 'Sponsors', href: '#sponsors' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Robogals', href: 'https://robogalsucalgary.com', external: true },
  ]

  const handleSmoothScroll = (e, href) => {
    e.preventDefault()
    // If we're not on the homepage, navigate there first
    if (location.pathname !== '/') {
      navigate('/')
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.querySelector(href)
        if (element) {
          const offset = 80
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
          const offsetPosition = elementPosition - offset
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
        }
      }, 100)
    } else {
      const element = document.querySelector(href)
      if (element) {
        const offset = 80
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - offset
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      }
    }
    setIsMobileMenuOpen(false)
  }

  const handleDashboardClick = () => {
    navigate('/dashboard')
    setIsMobileMenuOpen(false)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const handleAdminClick = () => {
    navigate('/admin')
    setIsMobileMenuOpen(false)
  }

  // Determine button text and action based on auth state
  const getRegisterButtonConfig = () => {
    if (user) {
      if (registration) {
        return { text: 'Dashboard', action: handleDashboardClick }
      } else {
        return { text: 'Complete Registration', action: onRegisterClick }
      }
    } else {
      return { text: 'Register', action: onRegisterClick }
    }
  }

  const buttonConfig = getRegisterButtonConfig()

  return (
    <motion.nav
      className={`navigation ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="nav-container">
        <motion.div
          className="nav-logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a href="#home" onClick={(e) => handleSmoothScroll(e, '#home')} className="nav-logo-link">
            <img src={Vector3} alt="" className="nav-logo-svg" />
            <span className="logo-text">Hack the Bias</span>
          </a>
        </motion.div>

        <ul className="nav-menu">
          {navItems.map((item, index) => (
            <motion.li
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {item.external ? (
                <a
                  href={item.href}
                  className="nav-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.name}
                </a>
              ) : (
                <a
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="nav-link"
                >
                  {item.name}
                </a>
              )}
            </motion.li>
          ))}
        </ul>

        <div className="nav-auth-buttons">
          {user ? (
            <>
              {isAdmin && (
                <motion.button
                  className="nav-admin-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAdminClick}
                >
                  <FaUserShield style={{ marginRight: '0.5rem' }} />
                  Admin
                </motion.button>
              )}
              <motion.button
                className="nav-register-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: isAdmin ? 0.3 : 0.25, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={buttonConfig.action}
              >
                <FaUser style={{ marginRight: '0.5rem' }} />
                {buttonConfig.text}
              </motion.button>
              <motion.button
                className="nav-signout-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: isAdmin ? 0.35 : 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
              >
                <FaSignOutAlt style={{ marginRight: '0.5rem' }} />
                Sign Out
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                className="nav-login-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLoginClick}
              >
                Login
              </motion.button>
              <motion.button
                className="nav-register-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRegisterClick}
              >
                Register
              </motion.button>
            </>
          )}
        </div>

        <div className="mobile-nav-right">
          {!user && (
            <button
              className="mobile-login-visible"
              onClick={onLoginClick}
            >
              Login
            </button>
          )}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item, index) => (
              item.external ? (
                <motion.a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="mobile-nav-link"
                >
                  {item.name}
                </motion.a>
              ) : (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="mobile-nav-link"
                >
                  {item.name}
                </motion.a>
              )
            ))}

            {user ? (
              <>
                {isAdmin && (
                  <motion.button
                    className="mobile-admin-btn"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navItems.length * 0.05 }}
                    onClick={handleAdminClick}
                  >
                    Admin Dashboard
                  </motion.button>
                )}
                <motion.button
                  className="mobile-dashboard-btn"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.05 + (isAdmin ? 0.05 : 0) }}
                  onClick={buttonConfig.action}
                >
                  {buttonConfig.text}
                </motion.button>
                <motion.button
                  className="mobile-signout-btn"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.05 + (isAdmin ? 0.1 : 0.05) }}
                  onClick={handleSignOut}
                >
                  Sign Out
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  className="mobile-login-btn"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  onClick={onLoginClick}
                >
                  Login
                </motion.button>
                <motion.button
                  className="mobile-register-btn"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.05 + 0.05 }}
                  onClick={onRegisterClick}
                >
                  Register
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navigation
