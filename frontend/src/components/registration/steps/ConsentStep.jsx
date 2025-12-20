import './StepStyles.css'

const ConsentStep = ({ formData, updateFormData, errors }) => {
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
            onChange={(e) => updateFormData({ is_minor: e.target.checked })}
            className="checkbox-input"
          />
          <label htmlFor="is_minor" className="checkbox-label">
            I am under 18 years of age
          </label>
        </div>
      </div>

      <div className="consent-notice">
        <p>
          <strong>Note:</strong> After registration, you will need to download and submit a signed
          {formData.is_minor ? ' Photo Release & Guardian Consent Form' : ' Photo Release Form'} from
          your dashboard to complete your registration.
        </p>
      </div>
    </div>
  )
}

export default ConsentStep
