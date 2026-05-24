const ITERATIONS = 100000

export const hashPassword = async (password) => {
  const enc = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    key,
    256
  )
  const saltB64 = btoa(String.fromCharCode(...salt))
  const hashB64 = btoa(String.fromCharCode(...new Uint8Array(bits)))
  return `pbkdf2:${ITERATIONS}:${saltB64}:${hashB64}`
}

export const verifyPassword = async (password, stored) => {
  const [, iters, saltB64, hashB64] = stored.split(':')
  const salt = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0))
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: parseInt(iters), hash: 'SHA-256' },
    key,
    256
  )
  const computed = btoa(String.fromCharCode(...new Uint8Array(bits)))
  return computed === hashB64
}
