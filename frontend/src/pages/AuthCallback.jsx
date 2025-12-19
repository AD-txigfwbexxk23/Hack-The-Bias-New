import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

const AuthCallback = () => {
  const navigate = useNavigate()

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
          }

          // Successfully authenticated, redirect to home
          // The AuthContext will pick up the session and show registration if needed
          navigate('/')
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

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #153166 0%, #1e4080 100%)',
      color: '#FFFFFF'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTopColor: '#FFFFFF',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p style={{ fontSize: '1.1rem' }}>Completing sign in...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}

export default AuthCallback
