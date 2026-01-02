import { useEffect, useMemo, useState } from 'react'
import { FaCheck, FaExternalLinkAlt, FaSortDown, FaSortUp } from 'react-icons/fa'
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
  const { session } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [preregistrations, setPreregistrations] = useState([])
  const [isPreregLoading, setIsPreregLoading] = useState(true)
  const [error, setError] = useState('')
  const [preregError, setPreregError] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [fridayFilter, setFridayFilter] = useState('all')
  const [saturdayFilter, setSaturdayFilter] = useState('all')
  const [registrationSearch, setRegistrationSearch] = useState('')
  const [preregSearch, setPreregSearch] = useState('')

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

    const loadPreregistrations = async () => {
      setIsPreregLoading(true)
      setPreregError('')

      try {
        const response = await fetch('/api/admin/preregistrations', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })

        if (!response.ok) {
          const detail = await parseErrorDetail(response, 'Failed to load preregistrations')
          throw new Error(detail)
        }

        const data = await response.json()
        setPreregistrations(data.preregistrations || [])
      } catch (err) {
        setPreregError(err.message || 'Failed to load preregistrations')
      } finally {
        setIsPreregLoading(false)
      }
    }

    if (!session?.access_token) {
      setIsLoading(false)
      setIsPreregLoading(false)
      return
    }

    loadRegistrations()
    loadPreregistrations()
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
        consentFormUrl: record.consent_form_url || null
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

    return {
      total,
      fridayCheckIns,
      saturdayCheckIns,
      fullyComplete
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

  const filteredPreregistrations = useMemo(() => (
    preregistrations.filter((record) => {
      const searchValue = preregSearch.trim().toLowerCase()
      const name = formatName(record).toLowerCase()
      const email = formatEmail(record).toLowerCase()
      return !searchValue || name.includes(searchValue) || email.includes(searchValue)
    })
  ), [preregistrations, preregSearch])

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

  if (!session?.access_token) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-empty-state">
            <h1>Admin Dashboard</h1>
            <p>Please sign in with an admin account to view registrations.</p>
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
        </div>

        <div className="admin-summary-grid">
          <div className="summary-card">
            <span>Total registrations</span>
            <strong>{summary.total}</strong>
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
                  <th onClick={() => toggleSort('registered')}>
                    Registered {sortIcon('registered')}
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
                    <td colSpan={6} className="admin-empty-row">
                      No registrations match the current filters.
                    </td>
                  </tr>
                ) : (
                  sortedRegistrations.map((record) => (
                    <tr key={record.id}>
                      <td>{record.name}</td>
                      <td>{record.email}</td>
                      <td>
                        {record.registered ? <FaCheck className="status-icon" /> : '—'}
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
                            onClick={() => openConsentForm(record.consentFormUrl)}
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

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>Preregistrations</h2>
            <span>{filteredPreregistrations.length} total</span>
          </div>
          <div className="admin-controls">
            <div className="filter-group">
              <label htmlFor="prereg-search">Search preregistrations</label>
              <input
                id="prereg-search"
                type="search"
                value={preregSearch}
                onChange={(event) => setPreregSearch(event.target.value)}
                placeholder="Search by name or email"
              />
            </div>
          </div>
          {isPreregLoading ? (
            <div className="admin-empty-state">Loading preregistrations...</div>
          ) : preregError ? (
            <div className="admin-empty-state error">{preregError}</div>
          ) : (
            <div className="admin-table-card">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPreregistrations.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="admin-empty-row">
                        No preregistrations yet.
                      </td>
                    </tr>
                  ) : (
                    filteredPreregistrations.map((record) => (
                      <tr key={record.id || record.email || record.created_at}>
                        <td>{formatName(record)}</td>
                        <td>{formatEmail(record)}</td>
                        <td>{formatDate(record.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage
