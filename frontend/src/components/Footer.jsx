import { motion } from 'framer-motion'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaGithub, FaInstagram, FaFacebook } from 'react-icons/fa'
import './Footer.css'

const Footer = ({ onRegisterClick }) => {
  const currentYear = new Date().getFullYear()

  const links = {
    event: [
      { name: 'About', href: '#about' },
      { name: 'Schedule', href: '#schedule' },
      { name: 'Prizes', href: '#prizes' },
      { name: 'FAQ', href: '#faq' },
    ],
  }

  const socialLinks = [
    { name: 'LinkedIn', icon: FaLinkedin, href: 'https://www.linkedin.com/company/hack-the-bias/', color: '#0077B5' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://https://www.instagram.com/hackthebias.ucalgary/', color: '#E4405F' },
  ]

  const contactInfo = [
    { icon: FaEnvelope, text: 'ucalgary.hackthebias@robogals.org', href: 'mailto:ucalgary.hackthebias@robogals.org' },
  ]

  const handleSmoothScroll = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        const offset = 80
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  return (
    <footer id="contact" className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="brand-title">Hack the Bias</h3>
            <p className="brand-description">
              Empowering diversity and inclusion in technology through innovation, collaboration, and action.
              Join us in building a more inclusive tech community.
            </p>
            <div className="brand-social">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={social.name}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ color: social.color }}
                  >
                    <Icon />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Links Sections */}
          <motion.div
            className="footer-links"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="links-column">
              <h4 className="links-title">Event</h4>
              <ul className="links-list">
                {links.event.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className="footer-link"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            className="footer-contact"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="contact-title">Get in Touch</h4>
            <div className="contact-info">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <motion.a
                    key={index}
                    href={info.href}
                    className="contact-item"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <Icon className="contact-icon" />
                    <span>{info.text}</span>
                  </motion.a>
                )
              })}
            </div>
            <motion.button
              className="footer-cta"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRegisterClick}
            >
              Pre Register
            </motion.button>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="footer-copyright">
            <p>&copy; {currentYear} Hack the Bias. All rights reserved.</p>
            <p className="footer-made-with">
              Made with <span className="heart">❤️</span> for diversity and inclusion
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer

