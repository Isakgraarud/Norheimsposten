import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuthState } from '../services/authService'
import { deleteComment, fetchComments, postComment } from '../services/commentService'
import '../styles/np-comments.css'

function CommentsSection({ articleId }) {
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef(null)

  const authState = getAuthState()
  const currentUser = authState?.user

  useEffect(() => {
    fetchComments(articleId)
      .then(setComments)
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [articleId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const body = textareaRef.current?.value?.trim()
    if (!body) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const newComment = await postComment(articleId, body)
      setComments((prev) => [...prev, newComment])
      textareaRef.current.value = ''
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(articleId, commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      setSubmitError(err.message)
    }
  }

  const canDelete = (comment) =>
    currentUser && (currentUser.id === comment.userId || currentUser.role === 'admin')

  return (
    <section className="np-comments">
      <h2 className="np-comments-heading">Kommentarer ({comments.length})</h2>

      {isLoading ? (
        <p className="np-comments-empty">Laster kommentarer...</p>
      ) : comments.length === 0 ? (
        <p className="np-comments-empty">Ingen kommentarer ennå. Vær den første!</p>
      ) : (
        <ul className="np-comments-list">
          {comments.map((comment) => (
            <li key={comment.id} className="np-comment">
              <div className="np-comment-meta">
                <span className="np-comment-author">{comment.authorName}</span>
                <time className="np-comment-time" dateTime={comment.createdAt}>
                  {new Date(comment.createdAt).toLocaleDateString('nb-NO', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
                {canDelete(comment) && (
                  <button
                    className="np-comment-delete"
                    onClick={() => handleDelete(comment.id)}
                    aria-label="Slett kommentar"
                  >
                    Slett
                  </button>
                )}
              </div>
              <p className="np-comment-body">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="np-comment-form-wrapper">
        {currentUser ? (
          <form className="np-comment-form" onSubmit={handleSubmit}>
            <label className="np-comment-form-label" htmlFor="comment-body">
              Legg igjen en kommentar
            </label>
            <textarea
              id="comment-body"
              className="np-comment-textarea"
              ref={textareaRef}
              rows={3}
              placeholder="Skriv her..."
              required
            />
            {submitError && <p className="np-comment-error">{submitError}</p>}
            <button className="np-comment-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sender...' : 'Send kommentar'}
            </button>
          </form>
        ) : (
          <p className="np-comment-login-prompt">
            <Link to="/login">Logg inn</Link> for å kommentere.
          </p>
        )}
      </div>
    </section>
  )
}

export default CommentsSection