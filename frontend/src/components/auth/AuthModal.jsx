import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaGoogle } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../utils/supabase'
import './AuthModal.css'

// Validate email format - checks for valid structure and real email providers
const isValidEmail = (email) => {
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Please enter a valid email address' }
  }

  // Extract domain
  const domain = email.split('@')[1].toLowerCase()

  // Block localhost and local domains
  if (domain === 'localhost' || domain.endsWith('.local') || domain.endsWith('.localhost')) {
    return { valid: false, reason: 'Please use a real email address, not a local address' }
  }

  // Block IP addresses as domains
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) {
    return { valid: false, reason: 'Please use a real email address, not an IP address' }
  }

  // Block single-word domains (no TLD)
  if (!domain.includes('.')) {
    return { valid: false, reason: 'Please enter a complete email address with a valid domain' }
  }

  // Block very short TLDs (less than 2 chars) or suspicious patterns
  const tld = domain.split('.').pop()
  if (tld.length < 2) {
    return { valid: false, reason: 'Please enter a valid email address' }
  }

  return { valid: true }
}

const AuthModal = ({ isOpen, onClose, mode, onModeChange, onAuthSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showSignupSuccess, setShowSignupSuccess] = useState(false)

  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFullName('')
    setError('')
    setShowSignupSuccess(false)
  }

  const handleClose = () => {
    // Only allow closing if not showing signup success (user must click continue)
    if (showSignupSuccess) {
      return // Prevent closing - user must acknowledge the spam message
    }
    resetForm()
    onClose()
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Validate email format
    const emailValidation = isValidEmail(email)
    if (!emailValidation.valid) {
      setError(emailValidation.reason)
      setIsSubmitting(false)
      return
    }

    // Check for restricted email domains
    const lowerEmail = email.toLowerCase()
    if (
      lowerEmail.includes('ucalgary') ||
      lowerEmail.includes('educbe') ||
      lowerEmail.includes('mtroyal')
    ) {
      setError('Please use a personal email address, not a school email.')
      setIsSubmitting(false)
      return
    }

    try {
      let result
      if (mode === 'login') {
        result = await signInWithEmail(email, password)
        if (result.error) {
          setError(result.error.message)
        } else {
          resetForm()
          onAuthSuccess()
        }
      } else {
        // SIGNUP: Create user through backend API (creates with email already verified)
        if (!fullName.trim()) {
          setError('Please enter your full name')
          setIsSubmitting(false)
          return
        }

        // Step 1: Create verified user via backend
        const createResponse = await fetch('/api/create-user-verified', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password,
            full_name: fullName.trim()
          })
        })

        const createResult = await createResponse.json()

        if (!createResponse.ok) {
          setError(createResult.detail || 'Failed to create account')
          return
        }

        // Step 2: Sign in with the new credentials
        result = await signInWithEmail(email, password)

        if (result.error) {
          setError(result.error.message)
          return
        }

        // Step 3: Send welcome email (now we have a session)
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.access_token) {
            await fetch('/api/send-google-signup-email', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: email,
                name: fullName
              })
            })
          }
        } catch (emailErr) {
          // Don't block signup if email fails
          console.error('Failed to send welcome email:', emailErr)
        }

        // Show success message with email check reminder (user must click to continue)
        setShowSignupSuccess(true)
      }
    } catch (err) {
      console.error('Auth error:', err)
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

  const handleContinueAfterSignup = () => {
    resetForm()
    onAuthSuccess()
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
            {!showSignupSuccess && (
              <button className="modal-close" onClick={handleClose} aria-label="Close">
                <FaTimes />
              </button>
            )}

            <div className="auth-modal-content">
              {showSignupSuccess ? (
                <div className="signup-success">
                  <div className="signup-success-icon">✓</div>
                  <h2 className="auth-modal-title">Account Created!</h2>
                  <p className="auth-modal-subtitle">Welcome to Hack the Bias 2026</p>
                  <div className="email-check-notice prominent">
                    <div className="email-icon">📧</div>
                    <h3>Important: Check Your Email!</h3>
                    <p>We've sent you a welcome email with some information.</p>
                    <div className="spam-warning">
                      <strong>⚠️ Check your Promotions and Spam/Junk folder!</strong>
                      <p>If you find our email there, please mark it as "Not Spam" or drag the email into your primary inbox so you don't miss future updates.</p>
                    </div>
                  </div>
                  <motion.button
                    className="continue-btn"
                    onClick={handleContinueAfterSignup}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    I understand, continue to registration
                  </motion.button>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AuthModal
