import { getAuthToken } from './authService'

const API_BASE = `${import.meta.env.VITE_API_BASE_URL ?? ''}/api/uploads`

export const uploadImage = async (file) => {
  const token = getAuthToken()
  if (!token) {
    throw new Error('Du må være logget inn for å laste opp')
  }

  const body = new FormData()
  body.append('image', file)

  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.message || 'Opplasting feilet')
  }

  return payload
}
