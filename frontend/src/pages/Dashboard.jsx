import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { useAuth } from '../contexts/AuthContext'
import { FaSignOutAlt, FaArrowLeft, FaCheck, FaEdit, FaDownload, FaExclamationTriangle } from 'react-icons/fa'
import './Dashboard.css'

// Consent form URLs
const MINOR_FORM_URL = '/Photo and Video Release Form (Minors) (1).pdf'
const ADULT_FORM_URL = '/Photo and Video Release Form Non-minors.pdf'

const Dashboard = () => {
  const { registration, signOut, session, refreshRegistration } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isUploadingConsent, setIsUploadingConsent] = useState(false)
  const [consentUploadMessage, setConsentUploadMessage] = useState('')
  const [selectedConsentFile, setSelectedConsentFile] = useState(null)
  const consentFileInputRef = useRef(null)

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

  const handleConsentFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        setConsentUploadMessage('Please upload a PDF, JPEG, or PNG file')
        return
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setConsentUploadMessage('File size must be under 5MB')
        return
      }
      setSelectedConsentFile(file)
      setConsentUploadMessage('')
    }
  }

  const handleConsentUpload = async () => {
    if (!selectedConsentFile) {
      setConsentUploadMessage('Please select a file first')
      return
    }

    setIsUploadingConsent(true)
    setConsentUploadMessage('')

    try {
      const formData = new FormData()
      formData.append('consent_form', selectedConsentFile)

      const response = await fetch('/api/registration/consent-form', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        await refreshRegistration()
        setSelectedConsentFile(null)
        setConsentUploadMessage('Consent form uploaded successfully!')
      } else {
        setConsentUploadMessage(result.detail || 'Failed to upload consent form')
      }
    } catch (error) {
      setConsentUploadMessage('Failed to upload consent form')
    } finally {
      setIsUploadingConsent(false)
    }
  }

  const consentFormSubmitted = registration?.consent_form_url
  const formUrl = encodeURI(registration?.is_minor ? MINOR_FORM_URL : ADULT_FORM_URL)
  const isIOSSafari = /iP(ad|hone|od)/.test(navigator.userAgent) &&
    /Safari/.test(navigator.userAgent) &&
    !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent)

  if (!registration) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1>Complete Your Registration</h1>
            <p>Please complete the registration form or sign in to your existing account to view your dashboard.</p>
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
            Registration Status:{' '}
            {consentFormSubmitted ? (
              <span className="status-confirmed">Confirmed</span>
            ) : (
              <span className="status-pending">Not Registered</span>
            )}
          </p>
          <button className="sign-out-btn" onClick={handleSignOut}>
            <FaSignOutAlt /> Sign Out
          </button>
        </div>

        {!consentFormSubmitted && (
          <motion.div
            className="consent-form-alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="alert-header">
              <FaExclamationTriangle className="alert-icon" />
              <h3>Action Required: Submit Your Consent Form</h3>
            </div>
            <p className="alert-description">
              Your registration is incomplete. Please download, sign, and upload your
              {registration.is_minor ? ' Photo Release & Guardian Consent Form' : ' Photo Release Form'} to complete your registration.
            </p>

            <div className="consent-form-actions">
              <a
                href={formUrl}
                target={isIOSSafari ? undefined : '_blank'}
                rel={isIOSSafari ? undefined : 'noopener noreferrer'}
                className="download-form-btn"
              >
                <FaDownload /> Download {registration.is_minor ? 'Minor Consent Form' : 'Photo Release Form'}
              </a>

              <div className="upload-section">
                <input
                  type="file"
                  ref={consentFileInputRef}
                  onChange={handleConsentFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                />
                <div
                  className={`file-upload-area ${selectedConsentFile ? 'has-file' : ''}`}
                  onClick={() => consentFileInputRef.current?.click()}
                >
                  {selectedConsentFile ? (
                    <>
                      <p className="file-upload-text">
                        <strong>File selected:</strong> {selectedConsentFile.name}
                      </p>
                      <p className="file-upload-hint">Click to change file</p>
                    </>
                  ) : (
                    <p className="file-upload-text">
                      <strong>Click to upload</strong> your signed form<br />
                      PDF, JPEG, or PNG (max 5MB)
                    </p>
                  )}
                </div>

                {selectedConsentFile && (
                  <button
                    className="submit-consent-btn"
                    onClick={handleConsentUpload}
                    disabled={isUploadingConsent}
                  >
                    {isUploadingConsent ? 'Uploading...' : 'Submit Consent Form'}
                  </button>
                )}
              </div>

              {consentUploadMessage && (
                <div className={`consent-message ${consentUploadMessage.includes('success') ? 'success' : 'error'}`}>
                  {consentUploadMessage}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {registration.hacker_code && consentFormSubmitted && (
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
              Follow us on{' '}
              <a
                href="https://www.instagram.com/hackthebias.ucalgary/"
                target="_blank"
                rel="noopener noreferrer"
              >Instagram</a> for updates and highlights.
            </li>
            <li>
              Join our <a
                href="https://discord.gg/kSdkjMcfG"
                target="_blank"
                rel="noopener noreferrer"
              >Discord</a> for announcements and community chat.
            </li>
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
