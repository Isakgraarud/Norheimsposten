import { getAuthToken } from './authService'

const API_BASE = '/api/articles'

export const fetchArticles = async () => {
  const response = await fetch(API_BASE, {
    headers: { Accept: 'application/json' },
  })

  const payload = await response.json().catch(() => [])
  if (!response.ok) {
    throw new Error(payload.message || 'Kunne ikke hente artikler')
  }

  return Array.isArray(payload) ? payload : []
}

export const fetchArticleById = async (articleId) => {
  const response = await fetch(`${API_BASE}/${articleId}`, {
    headers: { Accept: 'application/json' },
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.message || 'Kunne ikke hente artikkel')
  }

  return payload
}

export const createArticle = async (articleInput) => {
  const token = getAuthToken()
  if (!token) {
    throw new Error('Du må være logget inn for å publisere')
  }

  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(articleInput),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.message || 'Kunne ikke publisere artikkel')
  }

  return payload
}
