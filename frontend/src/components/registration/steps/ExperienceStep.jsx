import './StepStyles.css'

const ExperienceStep = ({ formData, updateFormData, errors }) => {
  return (
    <div className="step-container">
      <h3 className="step-title">Your Experience</h3>
      <p className="step-description">
        Tell us about your hackathon experience and skills. No experience is required!
      </p>

      <div className="form-group">
        <label>Have you participated in a hackathon before?</label>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="hackathon_experience"
              checked={formData.hackathon_experience === true}
              onChange={() => updateFormData({ hackathon_experience: true })}
              className="radio-input"
            />
            <span className="radio-label">Yes</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="hackathon_experience"
              checked={formData.hackathon_experience === false}
              onChange={() => updateFormData({ hackathon_experience: false, hackathon_count: '' })}
              className="radio-input"
            />
            <span className="radio-label">No</span>
          </label>
        </div>
      </div>

      {formData.hackathon_experience && (
        <div className="form-group">
          <label>
            How many hackathons have you participated in? <span className="required">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={formData.hackathon_count}
            onChange={(e) => updateFormData({ hackathon_count: e.target.value })}
            placeholder="Enter number"
            className={`form-input ${errors.hackathon_count ? 'error' : ''}`}
          />
          {errors.hackathon_count && <span className="field-error">{errors.hackathon_count}</span>}
        </div>
      )}

      <div className="form-group">
        <label>What relevant skills do you have?</label>
        <textarea
          value={formData.relevant_skills}
          onChange={(e) => updateFormData({ relevant_skills: e.target.value })}
          placeholder="e.g., Python, JavaScript, UI/UX Design, Data Analysis, Machine Learning, etc. (No experience required if you have none)"
          className="form-textarea"
          rows={4}
        />
        <p className="step-description" style={{ marginTop: 'var(--space-xs)', marginBottom: 0 }}>
          This is optional. Hack the Bias welcomes participants of all skill levels!
        </p>
      </div>

      <div className="form-group">
        <label>Would you be interested in a special beginners-only track?</label>
        <p className="step-description" style={{ marginBottom: 'var(--space-sm)' }}>
          This track is designed for first-time hackers with fewer participants and a more supportive environment. Prizes are slightly smaller but the experience is tailored for beginners.
        </p>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="interested_in_beginner"
              checked={formData.interested_in_beginner === true}
              onChange={() => updateFormData({ interested_in_beginner: true })}
              className="radio-input"
            />
            <span className="radio-label">Yes, I'm interested!</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="interested_in_beginner"
              checked={formData.interested_in_beginner === false}
              onChange={() => updateFormData({ interested_in_beginner: false })}
              className="radio-input"
            />
            <span className="radio-label">No, I'll join the main track</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default ExperienceStep
