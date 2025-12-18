import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registration, setRegistration] = useState(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchRegistration(session.access_token)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchRegistration(session.access_token)
        } else {
          setRegistration(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchRegistration = async (accessToken) => {
    try {
      const response = await fetch('/api/registration', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setRegistration(data)
        return data
      } else if (response.status === 404) {
        setRegistration(null)
        return null
      }
    } catch (error) {
      console.error('Failed to fetch registration:', error)
      setRegistration(null)
      return null
    }
  }

  // Check registration status and return result (for use after auth)
  const checkRegistrationStatus = async () => {
    // Get fresh session directly from Supabase (state might not be updated yet)
    const { data: { session: currentSession } } = await supabase.auth.getSession()
    if (currentSession?.access_token) {
      return await fetchRegistration(currentSession.access_token)
    }
    return null
  }

  const signInWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUpWithEmail = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })
    return { data, error }
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    setRegistration(null)
    return { error }
  }

  const refreshRegistration = async () => {
    if (session?.access_token) {
      await fetchRegistration(session.access_token)
    }
  }

  const value = {
    user,
    session,
    loading,
    registration,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    refreshRegistration,
    checkRegistrationStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
