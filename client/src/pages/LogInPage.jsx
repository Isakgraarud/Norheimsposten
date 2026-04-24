import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Masthead from '../components/Masthead'
import { loginAccount, registerAccount } from '../services/authService'
import '../styles/LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const [formMode, setFormMode] = useState('login')
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })
  const [registerRole, setRegisterRole] = useState('reader')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('')
    setIsSubmitting(true)

    try {
      if (formMode === 'register') {
        await registerAccount({
          email: credentials.email,
          password: credentials.password,
          role: registerRole,
        })
        setStatus('Konto opprettet. Logg inn for å fortsette.')
        setFormMode('login')
      } else {
        const payload = await loginAccount(credentials)
        const role = payload?.user?.role
        if (role === 'editor' || role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      }
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
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
              <div className="form-group">
                <label>EMAIL</label>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  className="login-input"
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