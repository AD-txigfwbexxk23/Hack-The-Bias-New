import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import StepIndicator from './StepIndicator'
import DemographicsStep from './steps/DemographicsStep'
import ExperienceStep from './steps/ExperienceStep'
import InterestStep from './steps/InterestStep'
import LogisticsStep from './steps/LogisticsStep'
import ConsentStep from './steps/ConsentStep'
import './RegistrationFlow.css'

const STEPS = [
  { id: 'demographics', title: 'Demographics', component: DemographicsStep },
  { id: 'experience', title: 'Experience', component: ExperienceStep },
  { id: 'interest', title: 'Interest', component: InterestStep },
  { id: 'logistics', title: 'Logistics', component: LogisticsStep },
  { id: 'consent', title: 'Consent', component: ConsentStep },
]

const RegistrationFlow = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Demographics
    education_level: '',
    education_level_other: '',
    grade: '',
    year: '',
    major: '',
    gender_identity: '',
    dietary_restrictions: '',
    // Experience
    hackathon_experience: false,
    hackathon_count: '',
    relevant_skills: '',
    interested_in_beginner: false,
    // Interest
    why_interested: '',
    creative_project: '',
    // Logistics
    staying_overnight: false,
    general_comments: '',
    // Consent
    rules_consent: false,
    is_minor: false,
    consent_form_file: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [stepErrors, setStepErrors] = useState({})

  const { session, refreshRegistration } = useAuth()
  const navigate = useNavigate()

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
    setError('')
  }

  const validateStep = (stepIndex) => {
    const errors = {}

    switch (stepIndex) {
      case 0: // Demographics
        if (!formData.education_level) errors.education_level = 'Please select your education level'
        if (formData.education_level === 'high_school' && !formData.grade) {
          errors.grade = 'Please select your grade'
        }
        if (formData.education_level === 'post_secondary' && !formData.year) {
          errors.year = 'Please select your year'
        }
        if ((formData.education_level === 'post_secondary' || formData.education_level === 'recent_graduate') && !formData.major?.trim()) {
          errors.major = 'Please enter your major or program'
        }
        if (formData.education_level === 'other' && !formData.education_level_other?.trim()) {
          errors.education_level_other = 'Please specify your education level'
        }
        if (!formData.gender_identity.trim()) errors.gender_identity = 'Please enter your gender identity'
        break

      case 1: // Experience
        if (formData.hackathon_experience && !formData.hackathon_count) {
          errors.hackathon_count = 'Please enter the number of hackathons'
        }
        break

      case 2: // Interest
        if (!formData.why_interested.trim()) errors.why_interested = 'Please tell us why you are interested'
        if (formData.why_interested.trim().length < 10) errors.why_interested = 'Please provide more detail'
        if (!formData.creative_project.trim()) errors.creative_project = 'Please describe a creative project'
        if (formData.creative_project.trim().length < 10) errors.creative_project = 'Please provide more detail'
        const wordCount = formData.creative_project.trim().split(/\s+/).length
        if (wordCount > 150) errors.creative_project = 'Please keep your response under 150 words'
        break

      case 3: // Logistics
        // No required validation for logistics step
        break

      case 4: // Consent
        if (!formData.rules_consent) errors.rules_consent = 'You must agree to the rules'
        if (!formData.consent_form_file) {
          errors.consent_form_file = formData.is_minor
            ? 'Please upload the signed guardian consent and photo release form'
            : 'Please upload the signed photo release form'
        }
        break
    }

    setStepErrors(errors)
    return Object.keys(errors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setStepErrors({})
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    setError('')

    try {
      const submitData = new FormData()

      // Add all form fields
      submitData.append('education_level', formData.education_level)
      if (formData.education_level === 'other' && formData.education_level_other) {
        submitData.append('education_level_other', formData.education_level_other)
      }
      submitData.append('gender_identity', formData.gender_identity)
      submitData.append('why_interested', formData.why_interested)
      submitData.append('creative_project', formData.creative_project)
      submitData.append('rules_consent', formData.rules_consent)
      submitData.append('hackathon_experience', formData.hackathon_experience)
      submitData.append('interested_in_beginner', formData.interested_in_beginner)
      submitData.append('staying_overnight', formData.staying_overnight)
      submitData.append('is_minor', formData.is_minor)

      // Optional fields
      if (formData.grade) submitData.append('grade', formData.grade)
      if (formData.year) submitData.append('year', formData.year)
      if (formData.major) submitData.append('major', formData.major)
      if (formData.dietary_restrictions) submitData.append('dietary_restrictions', formData.dietary_restrictions)
      if (formData.hackathon_count) submitData.append('hackathon_count', formData.hackathon_count)
      if (formData.relevant_skills) submitData.append('relevant_skills', formData.relevant_skills)
      if (formData.general_comments) submitData.append('general_comments', formData.general_comments)

      // File upload - consent form is required for everyone
      if (formData.consent_form_file) {
        submitData.append('consent_form', formData.consent_form_file)
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: submitData
      })

      // Check if response has content before parsing
      const contentType = response.headers.get('content-type')
      let result = {}

      if (contentType && contentType.includes('application/json')) {
        const text = await response.text()
        if (text) {
          result = JSON.parse(text)
        }
      }

      if (!response.ok) {
        throw new Error(result.detail || `Registration failed (${response.status})`)
      }

      // Refresh registration data in context
      await refreshRegistration()

      // Close modal and navigate to dashboard
      onClose()
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to submit registration')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setCurrentStep(0)
    setStepErrors({})
    setError('')
    onClose()
  }

  const CurrentStepComponent = STEPS[currentStep].component

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={handleClose}>
          <motion.div
            className="registration-modal-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={handleClose} aria-label="Close">
              <FaTimes />
            </button>

            <div className="registration-modal-content">
              <h2 className="registration-title">Complete Your Registration</h2>

              <StepIndicator
                steps={STEPS}
                currentStep={currentStep}
              />

              <div className="step-content">
                <CurrentStepComponent
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={stepErrors}
                />
              </div>

              {error && <div className="registration-error">{error}</div>}

              <div className="registration-nav">
                {currentStep > 0 && (
                  <motion.button
                    className="nav-btn prev-btn"
                    onClick={prevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                  >
                    Previous
                  </motion.button>
                )}

                {currentStep < STEPS.length - 1 ? (
                  <motion.button
                    className="nav-btn next-btn"
                    onClick={nextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                  >
                    Next
                  </motion.button>
                ) : (
                  <motion.button
                    className="nav-btn submit-btn"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                  >
                    {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default RegistrationFlow
