import { getAuthToken } from './authService'

const API_BASE = `${import.meta.env.VITE_API_BASE_URL ?? ''}/api/articles`

export const fetchComments = async (articleId) => {
  const response = await fetch(`${API_BASE}/${articleId}/comments`, {
    headers: { Accept: 'application/json' },
  })

  const payload = await response.json().catch(() => [])
  if (!response.ok) {
    throw new Error(payload.message || 'Kunne ikke hente kommentarer')
  }

  return Array.isArray(payload) ? payload : []
}

export const postComment = async (articleId, body) => {
  const token = getAuthToken()
  if (!token) throw new Error('Du må være logget inn for å kommentere')

  const response = await fetch(`${API_BASE}/${articleId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ body }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.message || 'Kunne ikke sende kommentar')
  }

  return payload
}

export const deleteComment = async (articleId, commentId) => {
  const token = getAuthToken()
  if (!token) throw new Error('Du må være logget inn')

  const response = await fetch(`${API_BASE}/${articleId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.message || 'Kunne ikke slette kommentar')
  }

  return payload
}