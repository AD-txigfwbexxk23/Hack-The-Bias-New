import { useRef } from 'react'
import './StepStyles.css'

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
      updateFormData({ guardian_form_file: file })
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

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
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Rules will be linked here') }}>
              Hack the Bias Rules and Code of Conduct
            </a>
            .
          </label>
        </div>
        {errors.rules_consent && <span className="field-error">{errors.rules_consent}</span>}
      </div>

      <div className="form-group">
        <label>
          Photo Release Signature <span className="required">*</span>
        </label>
        <p className="step-description" style={{ marginBottom: 'var(--space-sm)' }}>
          By typing your name below, you consent to being photographed during the event
          and allow Hack the Bias to use these photos for promotional purposes.
        </p>
        <input
          type="text"
          value={formData.photo_release_signature}
          onChange={(e) => updateFormData({ photo_release_signature: e.target.value })}
          placeholder="Type your full legal name as signature"
          className={`form-input ${errors.photo_release_signature ? 'error' : ''}`}
        />
        {errors.photo_release_signature && <span className="field-error">{errors.photo_release_signature}</span>}
      </div>

      <div className="form-group">
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="is_minor"
            checked={formData.is_minor}
            onChange={(e) => updateFormData({
              is_minor: e.target.checked,
              guardian_form_file: e.target.checked ? formData.guardian_form_file : null
            })}
            className="checkbox-input"
          />
          <label htmlFor="is_minor" className="checkbox-label">
            I am under 18 years of age
          </label>
        </div>
      </div>

      {formData.is_minor && (
        <div className="form-group">
          <label>
            Guardian Consent Form <span className="required">*</span>
          </label>
          <p className="step-description" style={{ marginBottom: 'var(--space-sm)' }}>
            Since you are under 18, please upload a signed guardian consent form
            with both your signature and your guardian's signature.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
          />
          <div
            className={`file-upload-area ${formData.guardian_form_file ? 'has-file' : ''} ${errors.guardian_form_file ? 'error' : ''}`}
            onClick={handleUploadClick}
          >
            {formData.guardian_form_file ? (
              <>
                <p className="file-upload-text">
                  <strong>File selected:</strong>
                </p>
                <p className="file-name">{formData.guardian_form_file.name}</p>
                <p className="file-upload-text" style={{ marginTop: 'var(--space-sm)' }}>
                  Click to change file
                </p>
              </>
            ) : (
              <p className="file-upload-text">
                <strong>Click to upload</strong> or drag and drop<br />
                PDF, JPEG, or PNG (max 5MB)
              </p>
            )}
          </div>
          {errors.guardian_form_file && <span className="field-error">{errors.guardian_form_file}</span>}
        </div>
      )}
    </div>
  )
}

export default ConsentStep
