import { Link, NavLink, useNavigate } from 'react-router-dom'
import { clearAuthState, getAuthState } from '../services/authService'
import '../styles/np-admin-page.css'

function SidebarItem({ to, icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => 'cms-nav-item' + (isActive ? ' is-active' : '')}
    >
      <span className="cms-nav-icon" aria-hidden="true">{icon}</span>
      <span>{label}</span>
    </NavLink>
  )
}

function SidebarSub({ to, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => 'cms-nav-sub' + (isActive ? ' is-active' : '')}
    >
      {label}
    </NavLink>
  )
}

function AdminLayout({ children, pageTitle, pageSubtitle, pageActions }) {
  const navigate = useNavigate()
  const auth = getAuthState()
  const role = auth?.user?.role || 'reader'
  const displayName = auth?.user?.displayName || auth?.user?.email || 'Editor'
  const firstName = displayName.split(' ')[0]
  const isAdmin = role === 'admin'

  const handleLogout = () => {
    clearAuthState()
    navigate('/')
  }

  return (
    <div className="cms-shell">
      <aside className="cms-sidebar">
        <div className="cms-brand">
          <p className="cms-brand-title">Norheimsposten</p>
          <p className="cms-brand-sub">Admin CMS</p>
        </div>

        <nav className="cms-nav" aria-label="Admin">
          <SidebarItem to="/admin" end icon="◫" label="Dashboard" />

          <div className="cms-nav-group-label">Articles</div>
          <SidebarItem to="/admin/articles" icon="📰" label="Manage" />
          <SidebarItem to="/admin/articles/new" icon="✎" label="New article" />

          {isAdmin ? (
            <>
              <div className="cms-nav-group-label">People</div>
              <SidebarItem to="/admin/users" icon="👥" label="Users & roles" />
            </>
          ) : null}
        </nav>

        <div className="cms-sidebar-footer">
          <Link to="/" className="cms-nav-item">
            <span className="cms-nav-icon" aria-hidden="true">←</span>
            <span>Back to site</span>
          </Link>
          <button type="button" className="cms-nav-item" onClick={handleLogout}>
            <span className="cms-nav-icon" aria-hidden="true">⎋</span>
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="cms-main">
        <header className="cms-topbar">
          <div className="cms-greet">
            Welcome back, {firstName}
            <small>You are signed in as {role}</small>
          </div>
          <div className="cms-topbar-tools">
            <span className={`cms-chip role-${role}`}>{role}</span>
          </div>
        </header>

        <main className="cms-content">
          {pageTitle ? (
            <div className="cms-page-head">
              <div>
                <h1 className="cms-page-title">{pageTitle}</h1>
                {pageSubtitle ? <p className="cms-page-sub">{pageSubtitle}</p> : null}
              </div>
              {pageActions ? <div className="cms-page-actions">{pageActions}</div> : null}
            </div>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
