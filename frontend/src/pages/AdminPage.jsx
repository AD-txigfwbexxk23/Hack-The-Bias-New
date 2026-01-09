import { useEffect, useMemo, useState } from 'react'
import { FaCheck, FaDownload, FaExternalLinkAlt, FaSortDown, FaSortUp } from 'react-icons/fa'
import * as XLSX from 'xlsx'
import { useAuth } from '../contexts/AuthContext'
import './AdminPage.css'

const toBoolean = (value) => value === true || value === 'true' || value === 1 || value === '1'

const pickFlag = (record, keys) => keys.some((key) => toBoolean(record?.[key]))

const formatName = (record) => record.full_name || record.name || 'Unknown'

const formatEmail = (record) => record.email || record.user_email || 'Unknown'

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString()
}

const AdminPage = () => {
  const { session, isAdmin } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [fridayFilter, setFridayFilter] = useState('all')
  const [saturdayFilter, setSaturdayFilter] = useState('all')
  const [registrationSearch, setRegistrationSearch] = useState('')
  const [advancedView, setAdvancedView] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState(null)

  useEffect(() => {
    const parseErrorDetail = async (response, fallbackMessage) => {
      const rawText = await response.text()
      let detail = ''
      if (rawText) {
        try {
          const parsed = JSON.parse(rawText)
          detail = parsed.detail || ''
        } catch {
          detail = rawText
        }
      }
      return detail || fallbackMessage
    }

    const loadRegistrations = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch('/api/admin/registrations', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })

        if (!response.ok) {
          const detail = await parseErrorDetail(response, 'Failed to load registrations')
          throw new Error(detail)
        }

        const data = await response.json()
        setRegistrations(data.registrations || [])
      } catch (err) {
        setError(err.message || 'Failed to load registrations')
      } finally {
        setIsLoading(false)
      }
    }

    if (!session?.access_token) {
      setIsLoading(false)
      return
    }

    loadRegistrations()
  }, [session])

  const normalizedRegistrations = useMemo(() => (
    registrations.map((record) => {
      const fridayCheckIn = pickFlag(record, [
        'check_in_friday',
        'friday_check_in',
        'checked_in_friday'
      ])
      const saturdayCheckIn = pickFlag(record, [
        'check_in_saturday',
        'saturday_check_in',
        'checked_in_saturday'
      ])
      const foodFriday = pickFlag(record, [
        'food_received_friday',
        'friday_food_received'
      ])
      const foodSaturday = pickFlag(record, [
        'food_received_saturday',
        'saturday_food_received'
      ])
      const registered = Boolean(
        record.consent_form_url ||
        toBoolean(record.is_registered) ||
        toBoolean(record.registered) ||
        ['registered', 'confirmed'].includes(record.status)
      )

      return {
        id: record.id || record.user_id || formatEmail(record),
        name: formatName(record),
        email: formatEmail(record),
        registered,
        fridayCheckIn,
        saturdayCheckIn,
        foodFriday,
        foodSaturday,
        consentFormUrl: record.consent_form_url || null,
        createdAt: record.created_at || null,
        stayingOvernight: toBoolean(record.staying_overnight),
        interestedInBeginner: toBoolean(record.interested_in_beginner)
      }
    })
  ), [registrations])

  const openConsentForm = async (consentFormPath) => {
    try {
      const response = await fetch(
        `/api/admin/consent-form-url?path=${encodeURIComponent(consentFormPath)}`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get consent form URL')
      }

      const data = await response.json()
      if (data.signed_url) {
        window.open(data.signed_url, '_blank')
      }
    } catch (err) {
      console.error('Failed to open consent form:', err)
      alert('Failed to open consent form. Please try again.')
    }
  }

  const summary = useMemo(() => {
    const total = normalizedRegistrations.length
    const fridayCheckIns = normalizedRegistrations.filter((r) => r.fridayCheckIn).length
    const saturdayCheckIns = normalizedRegistrations.filter((r) => r.saturdayCheckIn).length
    const fullyComplete = normalizedRegistrations.filter(
      (r) => r.fridayCheckIn && r.saturdayCheckIn
    ).length
    const interestedInBeginner = normalizedRegistrations.filter((r) => r.interestedInBeginner).length
    const stayingOvernight = normalizedRegistrations.filter((r) => r.stayingOvernight).length

    return {
      total,
      fridayCheckIns,
      saturdayCheckIns,
      fullyComplete,
      interestedInBeginner,
      stayingOvernight
    }
  }, [normalizedRegistrations])

  const filteredRegistrations = useMemo(() => (
    normalizedRegistrations.filter((record) => {
      const searchValue = registrationSearch.trim().toLowerCase()
      const matchesSearch = !searchValue
        || record.name.toLowerCase().includes(searchValue)
        || record.email.toLowerCase().includes(searchValue)
      const fridayMatch = fridayFilter === 'all'
        || (fridayFilter === 'checked' && record.fridayCheckIn)
        || (fridayFilter === 'not' && !record.fridayCheckIn)

      const saturdayMatch = saturdayFilter === 'all'
        || (saturdayFilter === 'checked' && record.saturdayCheckIn)
        || (saturdayFilter === 'not' && !record.saturdayCheckIn)

      return matchesSearch && fridayMatch && saturdayMatch
    })
  ), [normalizedRegistrations, fridayFilter, saturdayFilter, registrationSearch])

  const advancedFilteredRegistrations = useMemo(() => {
    const searchValue = registrationSearch.trim().toLowerCase()
    if (!searchValue) return registrations
    return registrations.filter((record) => (
      [record.full_name, record.name, record.email, record.user_email, record.hacker_code]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(searchValue))
    ))
  }, [registrations, registrationSearch])

  const sortedRegistrations = useMemo(() => {
    const sorted = [...filteredRegistrations]
    const { key, direction } = sortConfig
    const multiplier = direction === 'asc' ? 1 : -1

    sorted.sort((a, b) => {
      if (key === 'name' || key === 'email') {
        return a[key].localeCompare(b[key]) * multiplier
      }
      if (key === 'registered') {
        return (Number(a.registered) - Number(b.registered)) * multiplier
      }
      if (key === 'fridayCheckIn') {
        return (Number(a.fridayCheckIn) - Number(b.fridayCheckIn)) * multiplier
      }
      if (key === 'saturdayCheckIn') {
        return (Number(a.saturdayCheckIn) - Number(b.saturdayCheckIn)) * multiplier
      }
      if (key === 'stayingOvernight') {
        return (Number(a.stayingOvernight) - Number(b.stayingOvernight)) * multiplier
      }
      if (key === 'createdAt') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return (dateA - dateB) * multiplier
      }
      return 0
    })

    return sorted
  }, [filteredRegistrations, sortConfig])

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  const sortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null
    }
    return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
  }

  const exportToExcel = () => {
    const dataToExport = registrations.map((record) => ({
      'ID': record.id || '',
      'User ID': record.user_id || '',
      'Full Name': record.full_name || record.name || '',
      'Email': record.email || '',
      'Hacker Code': record.hacker_code || '',
      'Status': record.status || '',
      'Created At': record.created_at || '',
      'Education Level': record.education_level || '',
      'Education Level Other': record.education_level_other || '',
      'Grade': record.grade || '',
      'Year': record.year || '',
      'Major': record.major || '',
      'Gender Identity': record.gender_identity || '',
      'Dietary Restrictions': record.dietary_restrictions || '',
      'Hackathon Experience': record.hackathon_experience ? 'Yes' : 'No',
      'Hackathon Count': record.hackathon_count || '',
      'Relevant Skills': record.relevant_skills || '',
      'Interested in Beginner': record.interested_in_beginner ? 'Yes' : 'No',
      'Why Interested': record.why_interested || '',
      'Creative Project': record.creative_project || '',
      'Staying Overnight': record.staying_overnight ? 'Yes' : 'No',
      'General Comments': record.general_comments || '',
      'Rules Consent': record.rules_consent ? 'Yes' : 'No',
      'Is Minor': record.is_minor ? 'Yes' : 'No',
      'Consent Form URL': record.consent_form_url || '',
      'Friday Check-in': record.check_in_friday || record.friday_check_in || record.checked_in_friday ? 'Yes' : 'No',
      'Saturday Check-in': record.check_in_saturday || record.saturday_check_in || record.checked_in_saturday ? 'Yes' : 'No',
      'Friday Food Received': record.food_received_friday || record.friday_food_received ? 'Yes' : 'No',
      'Saturday Food Received': record.food_received_saturday || record.saturday_food_received ? 'Yes' : 'No',
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations')

    const today = new Date().toISOString().split('T')[0]
    XLSX.writeFile(workbook, `hack-the-bias-registrations-${today}.xlsx`)
  }

  const advancedColumns = [
    { key: 'full_name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'hacker_code', label: 'Hacker Code' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Created At', format: formatDate },
    { key: 'education_level', label: 'Education Level' },
    { key: 'education_level_other', label: 'Education (Other)' },
    { key: 'grade', label: 'Grade' },
    { key: 'year', label: 'Year' },
    { key: 'major', label: 'Major' },
    { key: 'gender_identity', label: 'Gender Identity' },
    { key: 'dietary_restrictions', label: 'Dietary Restrictions' },
    { key: 'hackathon_experience', label: 'Hackathon Exp', format: (v) => v ? 'Yes' : 'No' },
    { key: 'hackathon_count', label: 'Hackathon Count' },
    { key: 'relevant_skills', label: 'Relevant Skills' },
    { key: 'interested_in_beginner', label: 'Beginner Interest', format: (v) => v ? 'Yes' : 'No' },
    { key: 'why_interested', label: 'Why Interested' },
    { key: 'creative_project', label: 'Creative Project' },
    { key: 'staying_overnight', label: 'Staying Overnight', format: (v) => v ? 'Yes' : 'No' },
    { key: 'general_comments', label: 'General Comments' },
    { key: 'rules_consent', label: 'Rules Consent', format: (v) => v ? 'Yes' : 'No' },
    { key: 'is_minor', label: 'Is Minor', format: (v) => v ? 'Yes' : 'No' },
  ]

  if (!session?.access_token || !isAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-empty-state">
            <h1>Admin Dashboard</h1>
            <p>You do not have permission to access this page.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Track registrations, check-ins, and meal distribution at a glance.</p>
          </div>
          <div className="admin-header-actions">
            <button
              type="button"
              className={`view-toggle-btn ${advancedView ? 'active' : ''}`}
              onClick={() => setAdvancedView(!advancedView)}
            >
              {advancedView ? 'Simple View' : 'Advanced View'}
            </button>
            <button
              type="button"
              className="export-btn"
              onClick={exportToExcel}
              disabled={registrations.length === 0}
            >
              <FaDownload /> Export Excel
            </button>
          </div>
        </div>

        <div className="admin-summary-grid">
          <div className="summary-card">
            <span>Total registrations</span>
            <strong>{summary.total}</strong>
          </div>
          <div className="summary-card">
            <span>Interested in beginner</span>
            <strong>{summary.interestedInBeginner}</strong>
          </div>
          <div className="summary-card">
            <span>Staying overnight</span>
            <strong>{summary.stayingOvernight}</strong>
          </div>
          <div className="summary-card">
            <span>Friday check-ins</span>
            <strong>{summary.fridayCheckIns}</strong>
          </div>
          <div className="summary-card">
            <span>Saturday check-ins</span>
            <strong>{summary.saturdayCheckIns}</strong>
          </div>
          <div className="summary-card highlight">
            <span>Completed both check-ins</span>
            <strong>{summary.fullyComplete}</strong>
          </div>
        </div>

        <div className="admin-controls">
          <div className="filter-group">
            <label htmlFor="registration-search">Search registrations</label>
            <input
              id="registration-search"
              type="search"
              value={registrationSearch}
              onChange={(event) => setRegistrationSearch(event.target.value)}
              placeholder="Search by name or email"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="friday-filter">Friday check-in</label>
            <select
              id="friday-filter"
              value={fridayFilter}
              onChange={(event) => setFridayFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="checked">Checked in</option>
              <option value="not">Not checked in</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="saturday-filter">Saturday check-in</label>
            <select
              id="saturday-filter"
              value={saturdayFilter}
              onChange={(event) => setSaturdayFilter(event.target.value)}
            >
              <option value="all">All</option>
              <option value="checked">Checked in</option>
              <option value="not">Not checked in</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="admin-empty-state">Loading registrations...</div>
        ) : error ? (
          <div className="admin-empty-state error">{error}</div>
        ) : advancedView ? (
          <div className="admin-table-card advanced-table-wrapper">
            <table className="advanced-table">
              <thead>
                <tr>
                  {advancedColumns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {advancedFilteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={advancedColumns.length} className="admin-empty-row">
                      No registrations found.
                    </td>
                  </tr>
                ) : (
                  advancedFilteredRegistrations.map((record) => {
                    const rowId = record.id || record.user_id
                    return (
                      <tr
                        key={rowId}
                        className={selectedRowId === rowId ? 'selected-row' : ''}
                        onClick={() => setSelectedRowId(selectedRowId === rowId ? null : rowId)}
                      >
                        {advancedColumns.map((col) => {
                          const value = record[col.key]
                          const displayValue = col.format
                            ? col.format(value)
                            : (value ?? '—')
                          return <td key={col.key}>{displayValue || '—'}</td>
                        })}
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-table-card">
            <table>
              <thead>
                <tr>
                  <th onClick={() => toggleSort('name')}>
                    Name {sortIcon('name')}
                  </th>
                  <th onClick={() => toggleSort('email')}>
                    Email {sortIcon('email')}
                  </th>
                  <th onClick={() => toggleSort('createdAt')}>
                    Registered at {sortIcon('createdAt')}
                  </th>
                  <th onClick={() => toggleSort('stayingOvernight')}>
                    Overnight {sortIcon('stayingOvernight')}
                  </th>
                  <th onClick={() => toggleSort('fridayCheckIn')}>
                    Friday check-in {sortIcon('fridayCheckIn')}
                  </th>
                  <th onClick={() => toggleSort('saturdayCheckIn')}>
                    Saturday check-in {sortIcon('saturdayCheckIn')}
                  </th>
                  <th>Consent Form</th>
                </tr>
              </thead>
              <tbody>
                {sortedRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="admin-empty-row">
                      No registrations match the current filters.
                    </td>
                  </tr>
                ) : (
                  sortedRegistrations.map((record) => (
                    <tr
                      key={record.id}
                      className={selectedRowId === record.id ? 'selected-row' : ''}
                      onClick={() => setSelectedRowId(selectedRowId === record.id ? null : record.id)}
                    >
                      <td>{record.name}</td>
                      <td>{record.email}</td>
                      <td>{formatDate(record.createdAt)}</td>
                      <td>
                        {record.stayingOvernight ? <FaCheck className="status-icon" /> : '—'}
                      </td>
                      <td>
                        {record.fridayCheckIn ? <FaCheck className="status-icon" /> : '—'}
                      </td>
                      <td>
                        {record.saturdayCheckIn ? <FaCheck className="status-icon" /> : '—'}
                      </td>
                      <td>
                        {record.consentFormUrl ? (
                          <button
                            type="button"
                            className="consent-form-link"
                            onClick={(e) => {
                              e.stopPropagation()
                              openConsentForm(record.consentFormUrl)
                            }}
                          >
                            View <FaExternalLinkAlt />
                          </button>
                        ) : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
