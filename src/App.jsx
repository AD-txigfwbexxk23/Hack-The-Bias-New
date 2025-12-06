import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Sponsors from './components/Sponsors'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import RegistrationModal from './components/RegistrationModal'

function App() {
  const [scrollY, setScrollY] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="App">
      <Navigation scrollY={scrollY} onRegisterClick={() => setIsModalOpen(true)} />
      <Hero onRegisterClick={() => setIsModalOpen(true)} />
      <About />
      <Sponsors />
      <FAQ />
      <Footer onRegisterClick={() => setIsModalOpen(true)} />
      <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default App

