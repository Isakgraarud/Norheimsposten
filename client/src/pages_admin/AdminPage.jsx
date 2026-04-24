import { useState } from 'react'
import Masthead from '../components/Masthead'
import { createArticle } from '../services/articleService'
import { getAuthState } from '../services/authService'

function AdminPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Nyheter',
    ingress: '',
    content: '',
  })
  const [status, setStatus] = useState({ type: '', msg: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const authState = getAuthState()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', msg: '' })
    setIsSubmitting(true)

    try {
      await createArticle(formData)
      setStatus({ type: 'success', msg: 'Artikkelen er publisert.' })
      setFormData({ title: '', category: 'Nyheter', ingress: '', content: '' })
    } catch (error) {
      setStatus({ type: 'error', msg: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="np-page-shell">
      <Masthead activeSection="Admin" onSectionSelect={() => {}} />

      <main className="np-main" style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
        <div className="np-admin-shell" style={{ width: '100%', maxWidth: '800px' }}>
          <div className="np-admin-card">
            <header className="np-admin-head" style={{ marginBottom: '2rem' }}>
              <span className="np-admin-kicker">Redaksjonelt Panel</span>
              <h1 style={{ margin: '0.5rem 0' }}>Opprett Ny Artikkel</h1>
              <p>Fyll ut feltene under for å publisere en ny sak til forsiden.</p>
              <p style={{ marginTop: '0.5rem', color: '#555' }}>
                Innlogget som: {authState?.user?.email || 'ukjent bruker'}
              </p>
            </header>

            <form
              className="np-admin-form"
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: '600' }}>Tittel</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Skriv en fengende overskrift..."
                  required
                  style={{ width: '100%', padding: '12px', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: '600' }}>Kategori</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '12px', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: '600' }}>Ingress</label>
                <textarea
                  name="ingress"
                  rows="3"
                  value={formData.ingress}
                  onChange={handleChange}
                  placeholder="En kort oppsummering av saken..."
                  style={{ width: '100%', padding: '12px', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontWeight: '600' }}>Brødtekst</label>
                <textarea
                  name="content"
                  rows="10"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Skriv selve artikkelen her..."
                  required
                  style={{ width: '100%', padding: '12px', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: '#000',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                {isSubmitting ? 'Publiserer...' : 'Publiser Artikkel'}
              </button>
            </form>

            {status.msg ? (
              <div
                className={`np-admin-message is-${status.type}`}
                style={{
                  marginTop: '20px',
                  padding: '15px',
                  backgroundColor: status.type === 'success' ? '#e6fffa' : '#fff5f5',
                  border: `1px solid ${status.type === 'success' ? '#38b2ac' : '#f56565'}`,
                  color: status.type === 'success' ? '#2c7a7b' : '#c53030',
                }}
              >
                {status.msg}
              </div>
            ) : null}

            <footer className="np-admin-back" style={{ marginTop: '30px' }}>
              <a href="/" style={{ textDecoration: 'none', color: '#666' }}>
                &larr; Tilbake til forsiden
              </a>
            </footer>
          </div>
        </div>
      </main>

      <footer className="np-footer" style={{ textAlign: 'center', padding: '40px 0' }}>
        <p>Footer TEXT | &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default AdminPage