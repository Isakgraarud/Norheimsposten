import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from './AdminLayout.jsx'
import {
  createArticle,
  fetchArticleById,
  updateArticle,
} from '../services/articleService'
import { uploadImage } from '../services/uploadService'

const CATEGORY_OPTIONS = ['News', 'Sports', 'Memes', 'Politics', 'Culture', 'Other']

const EMPTY_FORM = {
  title: '',
  category: 'News',
  ingress: '',
  picture: '',
  content: '',
}

function AdminArticleEditor({ mode = 'new' }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = mode === 'edit'

  const [formData, setFormData] = useState(EMPTY_FORM)
  const [status, setStatus] = useState({ type: '', msg: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEdit)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isEdit || !id) return
    let cancelled = false
    const load = async () => {
      try {
        const article = await fetchArticleById(id)
        if (cancelled) return
        setFormData({
          title: article.title || '',
          category: article.category || 'News',
          ingress: article.ingress || '',
          picture: article.picture || '',
          content: article.content || '',
        })
      } catch (loadError) {
        if (!cancelled) setStatus({ type: 'error', msg: loadError.message })
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFilePicked = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setStatus({ type: '', msg: '' })
    setIsUploading(true)
    try {
      const { url } = await uploadImage(file)
      setFormData((prev) => ({ ...prev, picture: url }))
      setStatus({ type: 'success', msg: 'Image uploaded.' })
    } catch (uploadError) {
      setStatus({ type: 'error', msg: uploadError.message })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleClearPicture = () => {
    setFormData((prev) => ({ ...prev, picture: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', msg: '' })
    setIsSubmitting(true)
    try {
      if (isEdit) {
        await updateArticle(id, formData)
        setStatus({ type: 'success', msg: 'Article updated.' })
      } else {
        const created = await createArticle(formData)
        setStatus({ type: 'success', msg: 'Article published.' })
        if (created?._id) {
          navigate(`/admin/articles/${created._id}/edit`, { replace: true })
        } else {
          navigate('/admin/articles')
        }
      }
    } catch (submitError) {
      setStatus({ type: 'error', msg: submitError.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const title = isEdit ? 'Edit article' : 'New article'
  const subtitle = isEdit
    ? 'Update the story and republish.'
    : 'Fill out the fields to publish a new story to the front page.'

  return (
    <AdminLayout
      pageTitle={title}
      pageSubtitle={subtitle}
      pageActions={
        <Link to="/admin/articles" className="cms-btn is-ghost">← Back to articles</Link>
      }
    >
      {status.msg ? (
        <div className={`cms-alert is-${status.type}`}>{status.msg}</div>
      ) : null}

      {isLoading ? (
        <div className="cms-card">
          <div className="cms-card-body">Loading article…</div>
        </div>
      ) : (
        <form className="cms-form" onSubmit={handleSubmit}>
          <div className="cms-card">
            <div className="cms-card-head">
              <h2 className="cms-card-title">Story</h2>
            </div>
            <div className="cms-card-body cms-form-stack">
              <div className="cms-field">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Write a punchy headline…"
                  required
                />
              </div>

              <div className="cms-field">
                <label htmlFor="ingress">Ingress</label>
                <textarea
                  id="ingress"
                  name="ingress"
                  rows={3}
                  value={formData.ingress}
                  onChange={handleChange}
                  placeholder="A short summary that appears on the front page."
                />
                <span className="hint">Appears under the headline on listings.</span>
              </div>

              <div className="cms-field">
                <label htmlFor="content">Body</label>
                <textarea
                  id="content"
                  name="content"
                  rows={14}
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write the article body here…"
                  required
                />
              </div>
            </div>
          </div>

          <aside className="cms-form-stack">
            <div className="cms-card">
              <div className="cms-card-head">
                <h2 className="cms-card-title">Publishing</h2>
              </div>
              <div className="cms-card-body cms-form-stack">
                <div className="cms-field">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    {formData.category && !CATEGORY_OPTIONS.includes(formData.category) ? (
                      <option value={formData.category}>{formData.category}</option>
                    ) : null}
                  </select>
                </div>

                <div className="cms-field">
                  <label htmlFor="picture">Cover image</label>
                  <input
                    id="picture"
                    name="picture"
                    type="text"
                    value={formData.picture}
                    onChange={handleChange}
                    placeholder="Paste an image URL or upload below"
                  />
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="cms-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading…' : '⤴ Upload from device'}
                    </button>
                    {formData.picture ? (
                      <button
                        type="button"
                        className="cms-btn is-ghost"
                        onClick={handleClearPicture}
                        disabled={isUploading}
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFilePicked}
                    style={{ display: 'none' }}
                  />
                  <span className="hint">JPG, PNG, WebP, GIF or AVIF. Max 5 MB.</span>
                </div>

                <button
                  type="submit"
                  className="cms-btn is-primary"
                  disabled={isSubmitting}
                  style={{ justifyContent: 'center' }}
                >
                  {isSubmitting
                    ? isEdit ? 'Saving…' : 'Publishing…'
                    : isEdit ? 'Save changes' : 'Publish article'}
                </button>
              </div>
            </div>

            {formData.picture ? (
              <div className="cms-card">
                <div className="cms-card-head">
                  <h2 className="cms-card-title">Cover preview</h2>
                </div>
                <div className="cms-card-body">
                  <img
                    src={formData.picture}
                    alt=""
                    style={{ width: '100%', borderRadius: 6, display: 'block' }}
                  />
                </div>
              </div>
            ) : null}
          </aside>
        </form>
      )}
    </AdminLayout>
  )
}

export default AdminArticleEditor
