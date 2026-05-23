import { useNavigate } from 'react-router-dom'
import { clearAuthState, getAuthState } from '../services/authService'

export const NAV_SECTIONS = [
    'Home',
    'News',
    'Memes',
    'About Us',
    'Flappy'
]

export const dateTimeLabel = new Date().toLocaleDateString('en-EN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })


function Masthead({ onSectionSelect, activeSection }) {
  const navigate = useNavigate()
  const authState = getAuthState()
  const userRole = authState?.user?.role
  const displayName = authState?.user?.displayName || authState?.user?.email || ''
  const canPost = userRole === 'editor' || userRole === 'admin'

  const handleLogout = () => {
    clearAuthState()
    window.location.href = '/'
  }

  const handleSectionClick = (section) => {
    switch (section) {
      case 'Home':
        navigate('/')
        break
      case 'About Us':
        navigate('/about')
        break
      case 'News':
        navigate('/news')
        break
      case 'Memes':
        navigate('/memes')
        break
      case 'Flappy':
        navigate('/games')
        break
      default:
        onSectionSelect(section)
    }
  }

  return (
    <header className="np-masthead">
        <div className="np-topline">
            <span>DATE: {dateTimeLabel}</span>
            <span>
            ACCOUNT:{' '}
              {authState ? (
                <>
                  {displayName ? <span>{displayName}</span> : null}
                  {displayName ? ' ' : null}
                  {canPost ? <a href="/admin" className="np-login-link">Write new article</a> : null}
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
                   NORHEIMSPOSTEN
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
                onClick={() => handleSectionClick(section)}
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
