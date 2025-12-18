import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import AuthCallback from './pages/AuthCallback'
import AuthModal from './components/auth/AuthModal'
import RegistrationFlow from './components/registration/RegistrationFlow'
import { useAuth } from './contexts/AuthContext'

function App() {
  const [scrollY, setScrollY] = useState(0)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('signup')
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)

  const { user, registration, checkRegistrationStatus } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleRegisterClick = () => {
    if (user) {
      if (registration) {
        navigate('/dashboard')
      } else {
        setIsRegistrationOpen(true)
      }
    } else {
      setAuthMode('signup')
      setIsAuthModalOpen(true)
    }
  }

  const handleLoginClick = () => {
    setAuthMode('login')
    setIsAuthModalOpen(true)
  }

  const handleAuthSuccess = async () => {
    setIsAuthModalOpen(false)
    // Wait for registration check before deciding to open modal
    const existingRegistration = await checkRegistrationStatus()
    if (!existingRegistration) {
      setIsRegistrationOpen(true)
    } else {
      // User already registered, go to dashboard
      navigate('/dashboard')
    }
  }

  return (
    <div className="App">
      <Navigation
        scrollY={scrollY}
        onRegisterClick={handleRegisterClick}
        onLoginClick={handleLoginClick}
      />
      <Routes>
        <Route path="/" element={<HomePage onRegisterClick={handleRegisterClick} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
        onAuthSuccess={handleAuthSuccess}
      />
      <RegistrationFlow
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
      />
    </div>
  )
}

export default App
