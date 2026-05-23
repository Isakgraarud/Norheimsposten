import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Masthead from '../components/Masthead.jsx'
import { getAuthState } from '../services/authService'
import { fetchUsers, updateUserRole } from '../services/userService'

const ROLE_OPTIONS = ['reader', 'editor', 'admin']

function AdminUsersPage() {
  const authState = getAuthState()
  const currentUserId = authState?.user?.id
  const isAdmin = authState?.user?.role === 'admin'

  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingUserId, setSavingUserId] = useState('')
  const [feedback, setFeedback] = useState({ type: '', msg: '' })

  useEffect(() => {
    if (!isAdmin) {
      return
    }

    const loadUsers = async () => {
      setError('')
      setIsLoading(true)
      try {
        const data = await fetchUsers()
        setUsers(data)
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [isAdmin])

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  const handleRoleChange = async (userId, nextRole) => {
    setFeedback({ type: '', msg: '' })
    setSavingUserId(userId)
    try {
      const updated = await updateUserRole(userId, nextRole)
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, role: updated.role } : user))
      )
      setFeedback({ type: 'success', msg: `Rolle oppdatert for ${updated.displayName}` })
    } catch (saveError) {
      setFeedback({ type: 'error', msg: saveError.message })
    } finally {
      setSavingUserId('')
    }
  }

  return (
    <div className="np-page-shell">
      <Masthead activeSection="Admin" onSectionSelect={() => {}} />

      <main className="np-main" style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
        <div className="np-admin-shell" style={{ width: '100%', maxWidth: '900px' }}>
          <div className="np-admin-card">
            <header className="np-admin-head" style={{ marginBottom: '2rem' }}>
              <span className="np-admin-kicker">Adminpanel</span>
              <h1 style={{ margin: '0.5rem 0' }}>Brukere</h1>
              <p>Alle registrerte brukere. Endre rolle ved å velge i nedtrekkslisten.</p>
              <p style={{ marginTop: '0.5rem' }}>
                <Link to="/admin">&larr; Tilbake til skriv artikkel</Link>
              </p>
            </header>

            {feedback.msg ? (
              <div
                style={{
                  marginBottom: '1rem',
                  padding: '12px',
                  backgroundColor: feedback.type === 'success' ? '#e6fffa' : '#fff5f5',
                  border: `1px solid ${feedback.type === 'success' ? '#38b2ac' : '#f56565'}`,
                  color: feedback.type === 'success' ? '#2c7a7b' : '#c53030',
                }}
              >
                {feedback.msg}
              </div>
            ) : null}

            {isLoading ? <p>Laster brukere...</p> : null}
            {error ? <p style={{ color: '#c53030' }}>{error}</p> : null}

            {!isLoading && !error ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #000' }}>
                      <th style={{ padding: '10px 8px' }}>Navn</th>
                      <th style={{ padding: '10px 8px' }}>E-post</th>
                      <th style={{ padding: '10px 8px' }}>Rolle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const isSelf = user.id === currentUserId
                      const isSaving = savingUserId === user.id
                      return (
                        <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                          <td style={{ padding: '10px 8px' }}>
                            {user.displayName}
                            {isSelf ? (
                              <span style={{ marginLeft: '6px', color: '#888', fontSize: '0.85em' }}>
                                (deg)
                              </span>
                            ) : null}
                          </td>
                          <td style={{ padding: '10px 8px' }}>{user.email}</td>
                          <td style={{ padding: '10px 8px' }}>
                            <select
                              value={user.role}
                              disabled={isSelf || isSaving}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              style={{ padding: '6px 8px' }}
                            >
                              {ROLE_OPTIONS.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                            {isSaving ? (
                              <span style={{ marginLeft: '8px', color: '#666' }}>lagrer...</span>
                            ) : null}
                          </td>
                        </tr>
                      )
                    })}
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                          Ingen brukere funnet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      <footer className="np-footer" style={{ textAlign: 'center', padding: '40px 0' }}>
        <p>Footer TEXT | &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default AdminUsersPage
