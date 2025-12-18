import './StepStyles.css'

const InterestStep = ({ formData, updateFormData, errors }) => {
  const wordCount = formData.creative_project.trim()
    ? formData.creative_project.trim().split(/\s+/).length
    : 0

  return (
    <div className="step-container">
      <h3 className="step-title">Your Interest</h3>
      <p className="step-description">
        We'd love to hear about your motivation and creativity!
      </p>

      <div className="form-group">
        <label>
          Why are you interested in competing in Hack the Bias? <span className="required">*</span>
        </label>
        <textarea
          value={formData.why_interested}
          onChange={(e) => updateFormData({ why_interested: e.target.value })}
          placeholder="Tell us what excites you about this hackathon and what you hope to achieve..."
          className={`form-textarea ${errors.why_interested ? 'error' : ''}`}
          rows={4}
        />
        {errors.why_interested && <span className="field-error">{errors.why_interested}</span>}
      </div>

      <div className="form-group">
        <label>
          Tell us about something creative you have built or participated in <span className="required">*</span>
        </label>
        <textarea
          value={formData.creative_project}
          onChange={(e) => updateFormData({ creative_project: e.target.value })}
          placeholder="This could be a project, artwork, performance, community initiative, or anything else you're proud of..."
          className={`form-textarea ${errors.creative_project ? 'error' : ''}`}
          rows={5}
        />
        <div className={`word-count ${wordCount > 150 ? 'over-limit' : ''}`}>
          {wordCount}/150 words
        </div>
        {errors.creative_project && <span className="field-error">{errors.creative_project}</span>}
      </div>
    </div>
  )
}

export default InterestStep
