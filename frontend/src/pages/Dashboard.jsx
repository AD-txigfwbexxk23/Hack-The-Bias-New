import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { useAuth } from '../contexts/AuthContext'
import { FaSignOutAlt, FaArrowLeft, FaCheck, FaEdit } from 'react-icons/fa'
import './Dashboard.css'

const Dashboard = () => {
  const { registration, signOut, session, refreshRegistration } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const startEditing = () => {
    setEditData({
      dietary_restrictions: registration.dietary_restrictions || '',
      staying_overnight: registration.staying_overnight,
      interested_in_beginner: registration.interested_in_beginner,
      general_comments: registration.general_comments || ''
    })
    setIsEditing(true)
    setSaveMessage('')
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditData({})
    setSaveMessage('')
  }

  const saveChanges = async () => {
    setIsSaving(true)
    setSaveMessage('')

    try {
      const response = await fetch('/api/registration', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      })

      if (response.ok) {
        await refreshRegistration()
        setIsEditing(false)
        setSaveMessage('Changes saved successfully!')
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        const data = await response.json()
        setSaveMessage(data.detail || 'Failed to save changes')
      }
    } catch (error) {
      setSaveMessage('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
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

        {registration.hacker_code && (
          <div className="hacker-code-section">
            <motion.div
              className="hacker-code-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="qr-code-container">
                <QRCodeSVG
                  value={registration.hacker_code}
                  size={120}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="hacker-code-info">
                <h3>Your Hacker Code</h3>
                <div className="hacker-code-display">{registration.hacker_code}</div>
                <p>Present this code at check-in</p>
              </div>
            </motion.div>
          </div>
        )}

        <div className="dashboard-simple">
          <motion.div
            className="dashboard-card info-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="card-header">
              <h3>Your Information</h3>
              {!isEditing ? (
                <button className="edit-btn" onClick={startEditing}>
                  <FaEdit /> Edit
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={saveChanges} disabled={isSaving}>
                    <FaCheck /> {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button className="cancel-btn" onClick={cancelEditing} disabled={isSaving}>
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {saveMessage && (
              <div className={`save-message ${saveMessage.includes('success') ? 'success' : 'error'}`}>
                {saveMessage}
              </div>
            )}

            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <span>{registration.full_name}</span>
              </div>

              <div className="info-item">
                <label>Email</label>
                <span>{registration.email}</span>
              </div>

              <div className="info-item">
                <label>Dietary Restrictions</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.dietary_restrictions}
                    onChange={(e) => setEditData({ ...editData, dietary_restrictions: e.target.value })}
                    placeholder="None"
                    className="edit-input"
                  />
                ) : (
                  <span>{registration.dietary_restrictions || 'None'}</span>
                )}
              </div>

              <div className="info-item">
                <label>Staying Overnight</label>
                {isEditing ? (
                  <select
                    value={editData.staying_overnight ? 'yes' : 'no'}
                    onChange={(e) => setEditData({ ...editData, staying_overnight: e.target.value === 'yes' })}
                    className="edit-select"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                ) : (
                  <span>{registration.staying_overnight ? 'Yes' : 'No'}</span>
                )}
              </div>

              <div className="info-item">
                <label>Interested in Beginner Track</label>
                {isEditing ? (
                  <select
                    value={editData.interested_in_beginner ? 'yes' : 'no'}
                    onChange={(e) => setEditData({ ...editData, interested_in_beginner: e.target.value === 'yes' })}
                    className="edit-select"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                ) : (
                  <span>{registration.interested_in_beginner ? 'Yes' : 'No'}</span>
                )}
              </div>

              <div className="info-item full-width">
                <label>Comments / Accommodations</label>
                {isEditing ? (
                  <textarea
                    value={editData.general_comments}
                    onChange={(e) => setEditData({ ...editData, general_comments: e.target.value })}
                    placeholder="Any additional information..."
                    className="edit-textarea"
                    rows={3}
                  />
                ) : (
                  <span>{registration.general_comments || 'None'}</span>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="dashboard-info">
          <h3>What's Next?</h3>
          <ul>
            <li>You'll find out if you've been accepted to the beginner track closer to the event date.</li>
            <li>Keep an eye on your email for updates and important announcements.</li>
            <li>
              Check out the <a
                href="https://www.notion.so/Hack-the-Bias-Pre-Event-Packet-2ae21d407f5080c19d42d200fed62d47"
                target="_blank"
                rel="noopener noreferrer"
              >event guide</a> for everything you need to know.
            </li>
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
