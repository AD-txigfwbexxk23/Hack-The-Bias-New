import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaGoogle } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import './AuthModal.css'

const AuthModal = ({ isOpen, onClose, mode, onModeChange, onAuthSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFullName('')
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Check for restricted email domains
    const lowerEmail = email.toLowerCase()
    if (lowerEmail.includes('ucalgary') || lowerEmail.includes('educbe')) {
      setError('Please use a personal email address, not a school email.')
      setIsSubmitting(false)
      return
    }

    try {
      let result
      if (mode === 'login') {
        result = await signInWithEmail(email, password)
      } else {
        if (!fullName.trim()) {
          setError('Please enter your full name')
          setIsSubmitting(false)
          return
        }
        result = await signUpWithEmail(email, password, fullName.trim())
      }

      if (result.error) {
        setError(result.error.message)
      } else {
        resetForm()
        onAuthSuccess()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError('')
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
    }
    // Redirect happens automatically
  }

  const handleModeSwitch = (newMode) => {
    setError('')
    onModeChange(newMode)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div
            className="auth-modal-container"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <button className="modal-close" onClick={handleClose} aria-label="Close">
              <FaTimes />
            </button>

            <div className="auth-modal-content">
              <h2 className="auth-modal-title">
                {mode === 'login' ? 'Welcome Back' : 'Join Hack the Bias'}
              </h2>
              <p className="auth-modal-subtitle">
                {mode === 'login'
                  ? 'Sign in to access your dashboard'
                  : 'Create an account to register for the hackathon'}
              </p>

              <button className="google-auth-btn" onClick={handleGoogleAuth} type="button">
                <FaGoogle />
                <span>Continue with Google</span>
              </button>

              <div className="auth-divider">
                <span>or</span>
              </div>

              <form onSubmit={handleEmailAuth} className="auth-form">
                {mode === 'signup' && (
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      required={mode === 'signup'}
                      className="form-input"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your personal email"
                    required
                    className="form-input"
                  />
                  <p className="email-hint">Please use a personal email (e.g., Gmail, Outlook) rather than a school email.</p>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                    className="form-input"
                  />
                </div>

                {error && <div className="auth-error">{error}</div>}

                <motion.button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting
                    ? 'Please wait...'
                    : mode === 'login' ? 'Sign In' : 'Create Account'
                  }
                </motion.button>
              </form>

              <p className="auth-switch">
                {mode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button type="button" onClick={() => handleModeSwitch('signup')}>Sign up</button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button type="button" onClick={() => handleModeSwitch('login')}>Sign in</button>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AuthModal
