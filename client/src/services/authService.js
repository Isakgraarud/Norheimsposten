const AUTH_STORAGE_KEY = 'np_auth'
const API_BASE = '/api/auth'
const REQUEST_TIMEOUT_MS = 10000

const readAuthState = () => {
  try {
    const rawValue = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!rawValue) return null

    const parsed = JSON.parse(rawValue)
    if (!parsed?.token || !parsed?.user) return null
    return parsed
  } catch (_error) {
    return null
  }
}

const writeAuthState = (authState) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState))
}

const requestJson = async (path, options = {}) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    })

    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(payload.message || 'Request failed')
    }

    return payload
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.')
    }

    if (error instanceof TypeError) {
      throw new Error('No contact with the server. Please check that the backend is running and that the proxy port is correct.')
    }

    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

export const getAuthState = () => readAuthState()
export const getAuthToken = () => readAuthState()?.token ?? ''
export const clearAuthState = () => localStorage.removeItem(AUTH_STORAGE_KEY)

export const registerAccount = async ({ email, password, role }) => {
  return requestJson('/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, role }),
  })
}

export const loginAccount = async ({ email, password }) => {
  const payload = await requestJson('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  writeAuthState(payload)
  return payload
}