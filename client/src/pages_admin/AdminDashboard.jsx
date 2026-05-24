import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from './AdminLayout.jsx'
import { fetchArticles } from '../services/articleService'

const isSameLocalDay = (date, ref) =>
  date.getFullYear() === ref.getFullYear() &&
  date.getMonth() === ref.getMonth() &&
  date.getDate() === ref.getDate()

function StatCard({ label, value, foot }) {
  return (
    <div className="cms-stat">
      <span className="cms-stat-label">{label}</span>
      <span className="cms-stat-value">{value}</span>
      {foot ? <span className="cms-stat-foot">{foot}</span> : null}
    </div>
  )
}

function AdminDashboard() {
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await fetchArticles()
        if (!cancelled) setArticles(data)
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
  }, [])

  const stats = useMemo(() => {
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    const weekAgo = new Date(now)
    weekAgo.setDate(now.getDate() - 7)

    let today = 0
    let yest = 0
    let week = 0
    const categories = new Set()
    for (const a of articles) {
      const d = new Date(a.publishedAt || a.createdAt)
      if (isSameLocalDay(d, now)) today += 1
      if (isSameLocalDay(d, yesterday)) yest += 1
      if (d >= weekAgo) week += 1
      if (a.category) categories.add(a.category)
    }
    return { total: articles.length, today, yest, week, categories: categories.size }
  }, [articles])

  const recent = useMemo(
    () =>
      [...articles]
        .sort(
          (a, b) =>
            new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
        )
        .slice(0, 5),
    [articles]
  )

  return (
    <AdminLayout
      pageTitle="Dashboard"
      pageSubtitle="Overview of editorial activity"
      pageActions={
        <Link to="/admin/articles/new" className="cms-btn is-primary">
          <span aria-hidden="true">＋</span> New article
        </Link>
      }
    >
      {error ? <div className="cms-alert is-error">{error}</div> : null}

      <section className="cms-stats" aria-label="Stats">
        <StatCard
          label="Total articles"
          value={isLoading ? '–' : stats.total.toLocaleString('en-US')}
          foot="All published items"
        />
        <StatCard
          label="New today"
          value={isLoading ? '–' : `+${stats.today}`}
          foot="Since midnight"
        />
        <StatCard
          label="This week"
          value={isLoading ? '–' : stats.week.toLocaleString('en-US')}
          foot="Rolling 7 days"
        />
        <StatCard
          label="Published yesterday"
          value={isLoading ? '–' : stats.yest.toLocaleString('en-US')}
          foot={`${stats.categories} categories active`}
        />
      </section>

      <section className="cms-row">
        <div className="cms-card">
          <div className="cms-card-head">
            <h2 className="cms-card-title">Recent articles</h2>
            <Link to="/admin/articles" className="cms-btn is-ghost">View all →</Link>
          </div>
          <div className="cms-card-body is-flush">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Published</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td className="empty" colSpan={5}>Loading…</td></tr>
                ) : recent.length === 0 ? (
                  <tr><td className="empty" colSpan={5}>No articles yet — create the first one.</td></tr>
                ) : (
                  recent.map((a) => (
                    <tr key={a._id}>
                      <td className="id-cell">#{String(a._id).slice(-5)}</td>
                      <td className="title-cell">{a.title}</td>
                      <td>{a.category}</td>
                      <td>{a.authorName}</td>
                      <td>
                        {new Date(a.publishedAt || a.createdAt).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="cms-quick">
          <div className="cms-card">
            <div className="cms-card-head">
              <h2 className="cms-card-title">Quick tools</h2>
            </div>
            <div className="cms-card-body">
              <div className="cms-quick-stats">
                <div className="cms-quick-row">
                  <span>Total published</span>
                  <strong>{isLoading ? '–' : stats.total}</strong>
                </div>
                <div className="cms-quick-row">
                  <span>Categories</span>
                  <strong>{isLoading ? '–' : stats.categories}</strong>
                </div>
                <div className="cms-quick-row">
                  <span>This week</span>
                  <strong>{isLoading ? '–' : stats.week}</strong>
                </div>
              </div>
            </div>
          </div>

          <Link to="/admin/articles/new" className="cms-cta">
            <span className="cms-cta-plus" aria-hidden="true">＋</span>
            <strong>Create new article</strong>
            <span className="cms-stat-foot">Publish a story to the front page</span>
          </Link>
        </aside>
      </section>
    </AdminLayout>
  )
}

export default AdminDashboard
