import './StepStyles.css'

const DemographicsStep = ({ formData, updateFormData, errors }) => {
  const educationOptions = [
    { value: 'high_school', label: 'High School' },
    { value: 'post_secondary', label: 'Post-Secondary' },
    { value: 'recent_graduate', label: 'Recent Graduate' },
    { value: 'other', label: 'Other - Please Specify' },
  ]

  const gradeOptions = ['10', '11', '12']
  const yearOptions = ['1st', '2nd', '3rd', '4th', '5th+']

  const handleEducationChange = (e) => {
    updateFormData({
      education_level: e.target.value,
      education_level_other: '',
      grade: '',
      year: ''
    })
  }

  return (
    <div className="step-container">
      <h3 className="step-title">Tell us about yourself</h3>
      <p className="step-description">
        This information helps us provide the best experience for all participants.
      </p>

      <div className="form-group">
        <label>
          Education Level <span className="required">*</span>
        </label>
        <select
          value={formData.education_level}
          onChange={handleEducationChange}
          className={`form-select ${errors.education_level ? 'error' : ''}`}
        >
          <option value="">Select your education level</option>
          {educationOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.education_level && <span className="field-error">{errors.education_level}</span>}
      </div>

      {formData.education_level === 'high_school' && (
        <div className="form-group">
          <label>
            Grade <span className="required">*</span>
          </label>
          <select
            value={formData.grade}
            onChange={(e) => updateFormData({ grade: e.target.value })}
            className={`form-select ${errors.grade ? 'error' : ''}`}
          >
            <option value="">Select your grade</option>
            {gradeOptions.map(grade => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>
          {errors.grade && <span className="field-error">{errors.grade}</span>}
        </div>
      )}

      {formData.education_level === 'post_secondary' && (
        <div className="form-group">
          <label>
            Year <span className="required">*</span>
          </label>
          <select
            value={formData.year}
            onChange={(e) => updateFormData({ year: e.target.value })}
            className={`form-select ${errors.year ? 'error' : ''}`}
          >
            <option value="">Select your year</option>
            {yearOptions.map(year => (
              <option key={year} value={year}>{year} Year</option>
            ))}
          </select>
          {errors.year && <span className="field-error">{errors.year}</span>}
        </div>
      )}

      {formData.education_level === 'other' && (
        <div className="form-group">
          <label>
            Please Specify <span className="required">*</span>
          </label>
          <input
            type="text"
            value={formData.education_level_other || ''}
            onChange={(e) => updateFormData({ education_level_other: e.target.value })}
            placeholder="Please specify your education level"
            className={`form-input ${errors.education_level_other ? 'error' : ''}`}
          />
          {errors.education_level_other && <span className="field-error">{errors.education_level_other}</span>}
        </div>
      )}

      <div className="form-group">
        <label>
          Gender Identity <span className="required">*</span>
        </label>
        <input
          type="text"
          value={formData.gender_identity}
          onChange={(e) => updateFormData({ gender_identity: e.target.value })}
          placeholder="Enter your gender identity"
          className={`form-input ${errors.gender_identity ? 'error' : ''}`}
        />
        {errors.gender_identity && <span className="field-error">{errors.gender_identity}</span>}
      </div>

      <div className="form-group">
        <label>Dietary Restrictions</label>
        <input
          type="text"
          value={formData.dietary_restrictions}
          onChange={(e) => updateFormData({ dietary_restrictions: e.target.value })}
          placeholder="e.g., Vegetarian, Vegan, Gluten-free, Halal, None"
          className="form-input"
        />
      </div>
    </div>
  )
}

export default DemographicsStep
