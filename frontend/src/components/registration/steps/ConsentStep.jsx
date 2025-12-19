import { useRef } from 'react'
import { FaDownload } from 'react-icons/fa'
import './StepStyles.css'

// Placeholder URLs - replace with actual form links
const MINOR_FORM_URL = 'Photo and Video Release Form (Minors) (1).pdf'
const ADULT_FORM_URL = 'Photo and Video Release Form Non-minors.pdf'

const ConsentStep = ({ formData, updateFormData, errors }) => {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, JPEG, or PNG file')
        return
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be under 5MB')
        return
      }
      updateFormData({ consent_form_file: file })
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const formUrl = formData.is_minor ? MINOR_FORM_URL : ADULT_FORM_URL

  return (
    <div className="step-container">
      <h3 className="step-title">Consent & Legal</h3>
      <p className="step-description">
        Please review and agree to the following before completing your registration.
      </p>

      <div className="form-group">
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="rules_consent"
            checked={formData.rules_consent}
            onChange={(e) => updateFormData({ rules_consent: e.target.checked })}
            className={`checkbox-input ${errors.rules_consent ? 'error' : ''}`}
          />
          <label htmlFor="rules_consent" className="checkbox-label">
            <span className="required">*</span> I have read and agree to the{' '}
            <a href="/rules" target="_blank" rel="noopener noreferrer">
              Hack the Bias Rules and Code of Conduct
            </a>
            .
          </label>
        </div>
        {errors.rules_consent && <span className="field-error">{errors.rules_consent}</span>}
      </div>

      <div className="form-group">
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="is_minor"
            checked={formData.is_minor}
            onChange={(e) => updateFormData({
              is_minor: e.target.checked,
              consent_form_file: null  // Reset file when age status changes
            })}
            className="checkbox-input"
          />
          <label htmlFor="is_minor" className="checkbox-label">
            I am under 18 years of age
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>
          {formData.is_minor ? 'Photo Release & Guardian Consent Form' : 'Photo Release Form'} <span className="required">*</span>
        </label>
        <p className="step-description" style={{ marginBottom: 'var(--space-sm)' }}>
          {formData.is_minor ? (
            <>
              Since you are under 18, please download the form below, have it signed by both
              yourself and your parent/guardian, then upload the completed form.
            </>
          ) : (
            <>
              Please download the photo release form below, sign it, and upload the completed form.
              This allows Hack the Bias to use photos from the event for promotional purposes.
            </>
          )}
        </p>

        <a
          href={formUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="download-form-btn"
        >
          <FaDownload /> Download {formData.is_minor ? 'Minor Consent Form' : 'Photo Release Form'}
        </a>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
          style={{ display: 'none' }}
        />
        <div
          className={`file-upload-area ${formData.consent_form_file ? 'has-file' : ''} ${errors.consent_form_file ? 'error' : ''}`}
          onClick={handleUploadClick}
        >
          {formData.consent_form_file ? (
            <>
              <p className="file-upload-text">
                <strong>File selected:</strong>
              </p>
              <p className="file-name">{formData.consent_form_file.name}</p>
              <p className="file-upload-text" style={{ marginTop: 'var(--space-sm)' }}>
                Click to change file
              </p>
            </>
          ) : (
            <p className="file-upload-text">
              <strong>Click to upload</strong> your signed form<br />
              PDF, JPEG, or PNG (max 5MB)
            </p>
          )}
        </div>
        {errors.consent_form_file && <span className="field-error">{errors.consent_form_file}</span>}
      </div>
    </div>
  )
}

export default ConsentStep
