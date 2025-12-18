import './StepStyles.css'

const LogisticsStep = ({ formData, updateFormData, errors }) => {
  return (
    <div className="step-container">
      <h3 className="step-title">Event Logistics</h3>
      <p className="step-description">
        Help us plan for your participation at the event.
      </p>

      <div className="form-group">
        <label>Are you planning on staying overnight?</label>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="staying_overnight"
              checked={formData.staying_overnight === true}
              onChange={() => updateFormData({ staying_overnight: true })}
              className="radio-input"
            />
            <span className="radio-label">Yes</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="staying_overnight"
              checked={formData.staying_overnight === false}
              onChange={() => updateFormData({ staying_overnight: false })}
              className="radio-input"
            />
            <span className="radio-label">No</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>General Comments (Optional)</label>
        <textarea
          value={formData.general_comments}
          onChange={(e) => updateFormData({ general_comments: e.target.value })}
          placeholder="Any additional information or accommodations you'd like us to know about..."
          className="form-textarea"
          rows={3}
        />
      </div>
    </div>
  )
}

export default LogisticsStep
