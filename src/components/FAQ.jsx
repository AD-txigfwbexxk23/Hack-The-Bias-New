import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa'
import { BackgroundElements } from './BackgroundElements'
import { VectorPattern } from './VectorPattern'
import './FAQ.css'

const FAQ = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'Who can participate in Hack the Bias?',
      answer: 'Hack the Bias is open to everyone! Whether you\'re a beginner or an experienced developer, designer, or activist — we welcome all skill levels.',
    },
    {
      question: 'Do I need a team to join?',
      answer: 'Not at all! You can register solo and join a team at our team formation event at the beginning of the hackathon.',
    },
    {
      question: 'Is Hack the Bias free?',
      answer: 'Yes, participating in Hack the Bias is completely free. We\'ll even provide meals, swag, and some travel reimbursements for selected applicants.',
    },
    {
      question: 'What\'s the main theme of the hackathon?',
      answer: 'The theme centers around social justice and ethical innovation — building tech for inclusion, equity, and change.',
    },
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="faq" ref={ref}>
      {/* Background Elements */}
      <div className="faq-background">
        <BackgroundElements sectionRef={ref} />
        <VectorPattern vectors={['vector02']} size="small" opacity={0.1} />
      </div>

      <div className="faq-container">
        {/* Header */}
        <motion.div
          className="faq-header"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="faq-header-icon">
            <FaQuestionCircle />
          </div>
          <span className="section-badge">FAQ</span>
          <h2 className="section-title">
            Frequently Asked <span className="title-accent">Questions</span>
          </h2>
          <p className="section-description">
            Got questions? We've got answers.
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          className="faq-list"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.15 + index * 0.02 }}
              whileHover={{ scale: 1.01 }}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="question-text">{faq.question}</span>
                <motion.span
                  className="question-icon"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaChevronDown />
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <p className="answer-text">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Still Have Questions CTA */}
        <motion.div
          className="faq-cta"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 className="cta-title">Still have questions?</h3>
          <p className="cta-description">
            Can't find the answer you're looking for? Get in touch with our team and we'll be happy to help.
          </p>
          <motion.button
            className="cta-button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const footer = document.querySelector('#contact')
              if (footer) {
                footer.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ
