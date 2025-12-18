import Hero from '../components/Hero'
import About from '../components/About'
import Sponsors from '../components/Sponsors'
import Prizes from '../components/Prizes'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

const HomePage = ({ onRegisterClick }) => {
  return (
    <>
      <Hero onRegisterClick={onRegisterClick} />
      <About />
      <Prizes />
      <Sponsors />
      <FAQ />
      <Footer onRegisterClick={onRegisterClick} />
    </>
  )
}

export default HomePage
