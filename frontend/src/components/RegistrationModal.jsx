import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import ReCAPTCHA from 'react-google-recaptcha'
import { getApiUrl } from '../utils/api'
import './RegistrationModal.css'

const RegistrationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const recaptchaRef = useRef(null)
  
  // Get reCAPTCHA site key from environment variables
  // For Vite, use import.meta.env.VITE_RECAPTCHA_SITE_KEY
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''


  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)
    
    // Get reCAPTCHA token only if reCAPTCHA is enabled
    const captchaToken = recaptchaSiteKey ? recaptchaRef.current?.getValue() : null
    
    // Only require reCAPTCHA if site key is configured
    if (recaptchaSiteKey && !captchaToken) {
      setErrorMessage('Please complete the reCAPTCHA verification')
      setIsSubmitting(false)
      return
    }
    
    // If no reCAPTCHA key is set, use a placeholder token
    // Backend will skip verification if RECAPTCHA_SECRET is not set
    const tokenToSend = captchaToken || 'dev-bypass-token'
    
    try {
      // Trim whitespace from inputs
      const trimmedName = formData.name.trim()
      const trimmedEmail = formData.email.trim()
      
      const response = await fetch(getApiUrl('/preregister'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          captchaToken: tokenToSend,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        // Handle error responses - check for validation errors
        let errorMsg = result.detail || result.message || 'Registration failed'
        
        // If it's a validation error (422), try to extract a more user-friendly message
        if (response.status === 422 && result.detail) {
          // Pydantic validation errors often have "detail" as a string or array
          if (typeof result.detail === 'string') {
            errorMsg = result.detail
          } else if (Array.isArray(result.detail)) {
            // Extract the first error message
            errorMsg = result.detail[0]?.msg || 'Invalid input. Please check your form data.'
          }
        }
        
        throw new Error(errorMsg)
      }

      // Handle success or already registered
      if (result.status === 'already_registered') {
        alert(result.message || 'This email is already pre-registered!')
      } else {
        alert(result.message || 'Thank you for pre-registering! We\'ll be in touch soon.')
      }
      
      // Reset form and close modal
      setFormData({ name: '', email: '' })
      recaptchaRef.current?.reset()
      onClose()
    } catch (error) {
      console.error('Registration error:', error)
      setErrorMessage(error.message || 'Failed to register. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div
            className="modal-container"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <FaTimes />
            </button>
            
            <div className="modal-content">
              <h2 className="modal-title">Pre Register for Hack the Bias</h2>
              <p className="modal-description">
                Be the first to know when registration opens! Enter your details below.
              </p>
              
              <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                {recaptchaSiteKey ? (
                  <div className="form-group">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={recaptchaSiteKey}
                      theme="light"
                    />
                  </div>
                ) : (
                  <div className="form-group" style={{ 
                    padding: '0.75rem', 
                    backgroundColor: '#fff3cd', 
                    border: '1px solid #ffc107', 
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    color: '#856404'
                  }}>
                    ⚠️ Development mode: reCAPTCHA is disabled. Set VITE_RECAPTCHA_SITE_KEY to enable.
                  </div>
                )}
                
                {errorMessage && (
                  <div className="form-error" style={{ color: '#ff4444', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {errorMessage}
                  </div>
                )}
                
                <motion.button
                  type="submit"
                  className="form-submit-btn"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Pre Register'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default RegistrationModal

