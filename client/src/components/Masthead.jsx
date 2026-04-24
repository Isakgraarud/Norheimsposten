import { clearAuthState, getAuthState } from '../services/authService'

export const NAV_SECTIONS = [
  'Forside',
  'Nyheter',
  'Sport',
  'Kultur',
  'Meninger',
]

export const dateTimeLabel = new Date().toLocaleDateString('en-EN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })


function Masthead({ onSectionSelect, activeSection }) {
  const authState = getAuthState()
  const userRole = authState?.user?.role
  const canPost = userRole === 'editor' || userRole === 'admin'

  const handleLogout = () => {
    clearAuthState()
    window.location.href = '/'
  }

  return (
    <header className="np-masthead">
        <div className="np-topline">
            <span>DATE: {dateTimeLabel}</span>
            <span>
            ACCOUNT:{' '}
              {authState ? (
                <>
                  {canPost ? <a href="/admin" className="np-login-link">ADMIN</a> : null}
                  {' '}
                  <button type="button" className="np-login-link" onClick={handleLogout}>LOG OUT</button>
                </>
              ) : (
                <a href="/login" className="np-login-link">LOG IN</a>
              )}
            </span>
        </div>

      <div className="np-brand-row">
          <p className="np-tagline"></p>
          <div className="np-name">
              <span>
                  <a href="/" > HEADING </a>
              </span>
            <p className="np-tagline"></p>
          </div>
      </div>

      <nav className="np-nav" aria-label="MainSections">
        <ul>
          {NAV_SECTIONS.map((section) => (
            <li key={section}>
              <button
                type="button"
                className={activeSection === section ? 'is-active' : ''}
                aria-pressed={activeSection === section}
                onClick={() => onSectionSelect(section)}
              >
                {section}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Masthead
