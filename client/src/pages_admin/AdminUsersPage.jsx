import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import AdminLayout from './AdminLayout.jsx'
import { getAuthState } from '../services/authService'
import { fetchUsers, updateUserRole } from '../services/userService'

const ROLE_OPTIONS = ['reader', 'editor', 'admin']

function AdminUsersPage() {
  const auth = getAuthState()
  const currentUserId = auth?.user?.id
  const isAdmin = auth?.user?.role === 'admin'

  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingUserId, setSavingUserId] = useState('')
  const [feedback, setFeedback] = useState({ type: '', msg: '' })
  const [roleFilter, setRoleFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!isAdmin) return
    let cancelled = false
    const load = async () => {
      try {
        const data = await fetchUsers()
        if (!cancelled) setUsers(data)
      } catch (loadError) {
        if (!cancelled) setError(loadError.message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [isAdmin])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users
      .filter((u) => (roleFilter === 'all' ? true : u.role === roleFilter))
      .filter((u) =>
        q
          ? u.displayName?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q)
          : true
      )
  }, [users, roleFilter, search])

  const counts = useMemo(
    () => ({
      admin: users.filter((u) => u.role === 'admin').length,
      editor: users.filter((u) => u.role === 'editor').length,
      reader: users.filter((u) => u.role === 'reader').length,
    }),
    [users]
  )

  if (!isAdmin) return <Navigate to="/" replace />

  const handleRoleChange = async (userId, nextRole) => {
    setFeedback({ type: '', msg: '' })
    setSavingUserId(userId)
    try {
      const updated = await updateUserRole(userId, nextRole)
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u))
      )
      setFeedback({ type: 'success', msg: `Role updated for ${updated.displayName}` })
    } catch (saveError) {
      setFeedback({ type: 'error', msg: saveError.message })
    } finally {
      setSavingUserId('')
    }
  }

  return (
    <AdminLayout
      pageTitle="Users & roles"
      pageSubtitle="Promote readers to editors, or grant admin access. You can't change your own role."
    >
      {feedback.msg ? (
        <div className={`cms-alert is-${feedback.type}`}>{feedback.msg}</div>
      ) : null}
      {error ? <div className="cms-alert is-error">{error}</div> : null}

      <section className="cms-stats" aria-label="Role totals">
        <div className="cms-stat">
          <span className="cms-stat-label">Total users</span>
          <span className="cms-stat-value">{users.length}</span>
          <span className="cms-stat-foot">All registered accounts</span>
        </div>
        <div className="cms-stat">
          <span className="cms-stat-label">Admins</span>
          <span className="cms-stat-value">{counts.admin}</span>
          <span className="cms-stat-foot">Full access</span>
        </div>
        <div className="cms-stat">
          <span className="cms-stat-label">Editors</span>
          <span className="cms-stat-value">{counts.editor}</span>
          <span className="cms-stat-foot">Can publish articles</span>
        </div>
        <div className="cms-stat">
          <span className="cms-stat-label">Readers</span>
          <span className="cms-stat-value">{counts.reader}</span>
          <span className="cms-stat-foot">View-only accounts</span>
        </div>
      </section>

      <div className="cms-card">
        <div className="cms-card-head">
          <h2 className="cms-card-title">All users ({filtered.length})</h2>
          <div className="cms-filters">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All roles</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <input
              type="search"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="cms-card-body is-flush">
          <table className="cms-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Current role</th>
                <th>Change role</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td className="empty" colSpan={4}>Loading users…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td className="empty" colSpan={4}>No users match your filters.</td></tr>
              ) : (
                filtered.map((u) => {
                  const isSelf = u.id === currentUserId
                  const isSaving = savingUserId === u.id
                  return (
                    <tr key={u.id}>
                      <td className="title-cell">
                        {u.displayName}
                        {isSelf ? (
                          <span style={{ marginLeft: 6, color: 'var(--cms-muted)', fontWeight: 400, fontSize: '0.8em' }}>
                            (you)
                          </span>
                        ) : null}
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`cms-chip role-${u.role}`}>{u.role}</span>
                      </td>
                      <td>
                        <div className="cms-row-actions" style={{ alignItems: 'center' }}>
                          <select
                            value={u.role}
                            disabled={isSelf || isSaving}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            style={{
                              border: '1px solid var(--cms-line)',
                              borderRadius: 6,
                              padding: '0.35rem 0.6rem',
                              background: 'var(--cms-bg)',
                              font: 'inherit',
                              color: 'var(--cms-text)',
                            }}
                          >
                            {ROLE_OPTIONS.map((role) => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                          {isSaving ? (
                            <span style={{ color: 'var(--cms-muted)', fontSize: '0.85em' }}>saving…</span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminUsersPage
