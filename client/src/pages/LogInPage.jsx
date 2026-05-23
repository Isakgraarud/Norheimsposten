import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Masthead from '../components/Masthead'
import { loginAccount, registerAccount } from '../services/authService'
import '../styles/LoginPage.css'
import TypewriterLoader from '../components/Typewriterloader.jsx'

const LOADER_MIN_MS = 5000
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function LoginPage() {
  const navigate = useNavigate()
  const [formMode, setFormMode] = useState('login')
  const [credentials, setCredentials] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [registerRole, setRegisterRole] = useState('reader')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showLoader, setShowLoader] = useState(false)
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('')
    setIsSubmitting(true)
    setShowLoader(true)
    const loaderDelay = wait(LOADER_MIN_MS)

    try {
      if (formMode === 'register') {
        await Promise.all([
          registerAccount({
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            email: credentials.email,
            password: credentials.password,
            role: registerRole,
          }),
          loaderDelay,
        ])
        setStatus('Konto opprettet. Logg inn for å fortsette.')
        setFormMode('login')
      } else {
        const [payload] = await Promise.all([loginAccount(credentials), loaderDelay])
        const role = payload?.user?.role
        if (role === 'editor' || role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      }
    } catch (submitError) {
      await loaderDelay
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
      setShowLoader(false)
    }
  }
  if (showLoader) {
    return <TypewriterLoader />
}
  return (
    <div className="np-page-shell">
      <Masthead activeSection="" onSectionSelect={() => {}} />

      <main className="np-main login-container">
        <div className="np-admin-shell login-card-wrapper">
          <div className="np-admin-card login-card">
            <header className="np-admin-head login-header">
              <h1>{formMode === 'login' ? 'Logg Inn' : 'Opprett Konto'}</h1>
            </header>

            <form onSubmit={handleSubmit} className="login-form">
              {formMode === 'register' ? (
                <div className="form-group">
                  <label>FIRST NAME</label>
                  <input
                    type="text"
                    name="firstName"
                    value={credentials.firstName}
                    onChange={handleChange}
                    required
                    className="login-input"
                    autoComplete="given-name"
                  />
                </div>
              ) : null}

              {formMode === 'register' ? (
                <div className="form-group">
                  <label>LAST NAME</label>
                  <input
                    type="text"
                    name="lastName"
                    value={credentials.lastName}
                    onChange={handleChange}
                    required
                    className="login-input"
                    autoComplete="family-name"
                  />
                </div>
              ) : null}

              <div className="form-group">
                <label>EMAIL</label>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  className="login-input"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label>PASSWORD</label>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  minLength={8}
                  required
                  className="login-input"
                />
              </div>

              {formMode === 'register' ? (
                <div className="form-group">
                  <label>ROLE</label>
                  <select
                    className="login-input"
                    value={registerRole}
                    onChange={(e) => setRegisterRole(e.target.value)}
                  >
                    <option value="reader">reader</option>
                    <option value="editor">editor</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
              ) : null}

              {error ? <p className="error-message">{error}</p> : null}
              {status ? <p className="success-message">{status}</p> : null}

              <button type="submit" className="login-button" disabled={isSubmitting}>
                {isSubmitting ? 'Sender...' : formMode === 'login' ? 'Logg Inn' : 'Opprett Konto'}
              </button>
            </form>

            <footer className="login-footer">
              {formMode === 'login' ? (
                <button type="button" className="login-switch" onClick={() => setFormMode('register')}>
                  Ingen konto? Opprett konto
                </button>
              ) : (
                <button type="button" className="login-switch" onClick={() => setFormMode('login')}>
                  Har du konto? Gå til innlogging
                </button>
              )}
            </footer>
          </div>
        </div>
      </main>

      <footer className="np-footer page-footer">
        <p>Footer TEXT | &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>  
  )
}

export default LoginPage