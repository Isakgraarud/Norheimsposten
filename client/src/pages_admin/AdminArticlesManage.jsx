import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from './AdminLayout.jsx'
import { deleteArticle, fetchArticles } from '../services/articleService'
import { getAuthState } from '../services/authService'

function AdminArticlesManage() {
  const auth = getAuthState()
  const isAdmin = auth?.user?.role === 'admin'

  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState({ type: '', msg: '' })

  const [category, setCategory] = useState('all')
  const [author, setAuthor] = useState('all')
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await fetchArticles()
        if (!cancelled) setArticles(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(
    () => Array.from(new Set(articles.map((a) => a.category).filter(Boolean))).sort(),
    [articles]
  )
  const authors = useMemo(
    () => Array.from(new Set(articles.map((a) => a.authorName).filter(Boolean))).sort(),
    [articles]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return articles
      .filter((a) => (category === 'all' ? true : a.category === category))
      .filter((a) => (author === 'all' ? true : a.authorName === author))
      .filter((a) =>
        q
          ? a.title?.toLowerCase().includes(q) ||
            a.ingress?.toLowerCase().includes(q) ||
            a.authorName?.toLowerCase().includes(q)
          : true
      )
      .sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
      )
  }, [articles, category, author, search])

  const drafts = articles.filter((a) => a.status === 'draft').length
  const published = articles.filter((a) => (a.status || 'published') === 'published').length

  const handleDelete = async (id, title) => {
    if (!isAdmin) return
    const ok = window.confirm(`Delete article "${title}"? This cannot be undone.`)
    if (!ok) return
    setDeletingId(id)
    setFeedback({ type: '', msg: '' })
    try {
      await deleteArticle(id)
      setArticles((prev) => prev.filter((a) => a._id !== id))
      setFeedback({ type: 'success', msg: `Deleted "${title}".` })
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message })
    } finally {
      setDeletingId('')
    }
  }

  return (
    <AdminLayout
      pageTitle="Article management"
      pageSubtitle="Search, filter, edit, or remove articles from the front page"
      pageActions={
        <Link to="/admin/articles/new" className="cms-btn is-primary">
          <span aria-hidden="true">＋</span> New article
        </Link>
      }
    >
      {feedback.msg ? (
        <div className={`cms-alert is-${feedback.type}`}>{feedback.msg}</div>
      ) : null}
      {error ? <div className="cms-alert is-error">{error}</div> : null}

      <section className="cms-row">
        <div className="cms-card">
          <div className="cms-card-head">
            <h2 className="cms-card-title">All articles ({filtered.length})</h2>
            <div className="cms-filters">
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select value={author} onChange={(e) => setAuthor(e.target.value)}>
                <option value="all">All authors</option>
                {authors.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <input
                type="search"
                placeholder="Search title, ingress, author…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="cms-card-body is-flush">
            <table className="cms-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td className="empty" colSpan={7}>Loading…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td className="empty" colSpan={7}>No articles match your filters.</td></tr>
                ) : (
                  filtered.map((a) => {
                    const status = a.status || 'published'
                    return (
                      <tr key={a._id}>
                        <td className="id-cell">#{String(a._id).slice(-5)}</td>
                        <td className="title-cell">{a.title}</td>
                        <td>
                          <span className={`cms-status is-${status}`}>{status}</span>
                        </td>
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
                        <td>
                          <div className="cms-row-actions">
                            <Link
                              to={`/admin/articles/${a._id}/edit`}
                              className="cms-btn"
                            >
                              Edit
                            </Link>
                            <Link
                              to={`/articles/${a._id}`}
                              className="cms-btn is-ghost"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Preview
                            </Link>
                            {isAdmin ? (
                              <button
                                type="button"
                                className="cms-btn is-danger"
                                disabled={deletingId === a._id}
                                onClick={() => handleDelete(a._id, a.title)}
                              >
                                {deletingId === a._id ? '…' : 'Delete'}
                              </button>
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

        <aside className="cms-quick">
          <div className="cms-card">
            <div className="cms-card-head">
              <h2 className="cms-card-title">Quick tools</h2>
            </div>
            <div className="cms-card-body">
              <div className="cms-quick-stats">
                <div className="cms-quick-row">
                  <span>Drafts</span>
                  <strong>{drafts}</strong>
                </div>
                <div className="cms-quick-row">
                  <span>Published</span>
                  <strong>{published}</strong>
                </div>
                <div className="cms-quick-row">
                  <span>Categories</span>
                  <strong>{categories.length}</strong>
                </div>
              </div>
            </div>
          </div>

          <Link to="/admin/articles/new" className="cms-cta">
            <span className="cms-cta-plus" aria-hidden="true">＋</span>
            <strong>Create new article</strong>
            <span className="cms-stat-foot">Publish to the front page</span>
          </Link>
        </aside>
      </section>
    </AdminLayout>
  )
}

export default AdminArticlesManage
