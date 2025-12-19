import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import './AuthCallback.css'

const AuthCallback = () => {
  const navigate = useNavigate()
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          navigate('/?auth_error=true')
          return
        }

        if (data.session) {
          const user = data.session.user

          // Check if this is a new user (created within the last 2 minutes)
          const createdAt = new Date(user.created_at)
          const now = new Date()
          const timeDiffMs = now - createdAt
          const isNewUser = timeDiffMs < 2 * 60 * 1000 // 2 minutes

          // Check if user signed up via Google OAuth
          const isGoogleAuth = user.app_metadata?.provider === 'google'

          if (isNewUser && isGoogleAuth) {
            // Send welcome email for new Google OAuth signups
            const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0]

            try {
              await fetch('/api/send-google-signup-email', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${data.session.access_token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  email: user.email,
                  name: name
                })
              })
            } catch (emailErr) {
              // Don't block the flow if email fails
              console.error('Failed to send welcome email:', emailErr)
            }

            // Show welcome message with spam warning for new users
            setShowWelcome(true)
          } else {
            // Existing user, redirect immediately
            navigate('/')
          }
        } else {
          navigate('/')
        }
      } catch (err) {
        console.error('Auth callback exception:', err)
        navigate('/?auth_error=true')
      }
    }

    handleCallback()
  }, [navigate])

  const handleContinue = () => {
    // Redirect to home with flag to open registration modal
    navigate('/?openRegistration=true')
  }

  if (showWelcome) {
    return (
      <div className="auth-callback-container">
        <div className="welcome-card">
          <div className="welcome-icon">✓</div>
          <h1>Account Created!</h1>
          <p className="welcome-subtitle">Welcome to Hack the Bias 2026</p>

          <div className="email-notice">
            <div className="email-icon">📧</div>
            <h2>Important: Check Your Email!</h2>
            <p>We've sent you a welcome email with important information.</p>
            <div className="spam-warning">
              <strong>⚠️ Check your Spam/Junk folder!</strong>
              <p>If you find our email there, please mark it as "Not Spam" so you don't miss future updates.</p>
            </div>
          </div>

          <button className="continue-btn" onClick={handleContinue}>
            I understand, continue to registration
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-callback-container">
      <div className="loading-content">
        <div className="spinner" />
        <p>Completing sign in...</p>
      </div>
    </div>
  )
}

export default AuthCallback
