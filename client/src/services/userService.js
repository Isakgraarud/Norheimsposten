import { getAuthToken } from './authService'

const API_BASE = `${import.meta.env.VITE_API_BASE_URL ?? ''}/api/users`

const authHeaders = () => {
  const token = getAuthToken()
  if (!token) {
    throw new Error('Du må være logget inn')
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export const fetchUsers = async () => {
  const response = await fetch(API_BASE, {
    headers: { ...authHeaders(), Accept: 'application/json' },
  })

  const payload = await response.json().catch(() => [])
  if (!response.ok) {
    throw new Error(payload.message || 'Kunne ikke hente brukere')
  }

  return Array.isArray(payload) ? payload : []
}

export const updateUserRole = async (userId, role) => {
  const response = await fetch(`${API_BASE}/${userId}/role`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ role }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.message || 'Kunne ikke endre rolle')
  }

  return payload
}
