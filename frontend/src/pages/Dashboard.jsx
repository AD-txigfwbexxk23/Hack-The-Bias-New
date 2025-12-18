import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { FaUser, FaGraduationCap, FaLightbulb, FaClipboardCheck, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa'
import './Dashboard.css'

const Dashboard = () => {
  const { user, registration, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const formatEducationLevel = (level, otherValue) => {
    const map = {
      'high_school': 'High School',
      'post_secondary': 'Post-Secondary',
      'recent_graduate': 'Recent Graduate',
      'other': otherValue || 'Other'
    }
    return map[level] || level
  }

  if (!registration) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Complete Your Registration</h1>
            <p>Please complete the registration form to view your dashboard.</p>
            <button className="back-btn" onClick={() => navigate('/')}>
              <FaArrowLeft /> Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <motion.div
        className="dashboard-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dashboard-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            <FaArrowLeft /> Back to Home
          </button>
          <h1>Welcome, {registration.full_name}!</h1>
          <p className="registration-status">
            Registration Status: <span className="status-confirmed">Confirmed</span>
          </p>
          <button className="sign-out-btn" onClick={handleSignOut}>
            <FaSignOutAlt /> Sign Out
          </button>
        </div>

        <div className="dashboard-grid">
          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="card-icon"><FaUser /></div>
            <h3>Demographics</h3>
            <ul>
              <li><strong>Email:</strong> {registration.email}</li>
              <li><strong>Education:</strong> {formatEducationLevel(registration.education_level, registration.education_level_other)}</li>
              {registration.grade && <li><strong>Grade:</strong> {registration.grade}</li>}
              {registration.year && <li><strong>Year:</strong> {registration.year}</li>}
              <li><strong>Gender:</strong> {registration.gender_identity}</li>
              <li><strong>Dietary:</strong> {registration.dietary_restrictions || 'None specified'}</li>
            </ul>
          </motion.div>

          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card-icon"><FaGraduationCap /></div>
            <h3>Experience</h3>
            <ul>
              <li>
                <strong>Hackathon Experience:</strong>{' '}
                {registration.hackathon_experience ? 'Yes' : 'No (First timer!)'}
              </li>
              {registration.hackathon_count && (
                <li><strong>Hackathons Attended:</strong> {registration.hackathon_count}</li>
              )}
              {registration.relevant_skills && (
                <li><strong>Skills:</strong> {registration.relevant_skills}</li>
              )}
            </ul>
          </motion.div>

          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card-icon"><FaLightbulb /></div>
            <h3>Your Interest</h3>
            <div className="card-section">
              <strong>Why Hack the Bias:</strong>
              <p className="card-text">{registration.why_interested}</p>
            </div>
            <div className="card-section">
              <strong>Creative Project:</strong>
              <p className="card-text">{registration.creative_project}</p>
            </div>
          </motion.div>

          <motion.div
            className="dashboard-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card-icon"><FaClipboardCheck /></div>
            <h3>Logistics</h3>
            <ul>
              <li>
                <strong>Staying Overnight:</strong>{' '}
                {registration.staying_overnight ? 'Yes' : 'No'}
              </li>
              <li>
                <strong>Photo Release:</strong> Signed
              </li>
              {registration.is_minor && (
                <li><strong>Guardian Form:</strong> Submitted</li>
              )}
            </ul>
            {registration.general_comments && (
              <div className="card-section">
                <strong>Comments:</strong>
                <p className="card-text">{registration.general_comments}</p>
              </div>
            )}
          </motion.div>
        </div>

        <div className="dashboard-info">
          <h3>What's Next?</h3>
          <ul>
            <li>Teams will be formed on the Hack the Bias portal closer to the event date.</li>
            <li>Check your email for updates and important announcements.</li>
            <li>Remember to arrive between 8:00 AM - 12:00 PM on the event day.</li>
          </ul>
        </div>

        <div className="dashboard-footer">
          <p>Questions? Contact us at <a href="mailto:hackthebias.ucalgary@gmail.com">hackthebias.ucalgary@gmail.com</a></p>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
