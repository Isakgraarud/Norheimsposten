export async function fetchMovies() {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, 8000)

  let response

  try {
    response = await fetch('/api/movies', { signal: controller.signal })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Serveren brukte for lang tid pa a svare')
    }

    throw new Error('Kunne ikke na serveren for filmer')
  } finally {
    clearTimeout(timeoutId)
  }

  if (!response.ok) {
    throw new Error('Kunne ikke hente filmer fra serveren')
  }

  const payload = await response.json()

  if (!Array.isArray(payload)) {
    return []
  }

  return payload
}

export async function createMovie(movieInput) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, 8000)

  let response

  try {
    response = await fetch('/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movieInput),
      signal: controller.signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Serveren brukte for lang tid pa a svare')
    }

    throw new Error('Kunne ikke na serveren for lagring av film')
  } finally {
    clearTimeout(timeoutId)
  }

  if (!response.ok) {
    let payload
    try {
      payload = await response.json()
    } catch {
      payload = null
    }

    throw new Error(payload?.message || 'Kunne ikke lagre film til serveren')
  }

  return response.json()
}
