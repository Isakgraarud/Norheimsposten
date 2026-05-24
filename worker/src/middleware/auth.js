import { jwtVerify, SignJWT } from 'jose'

export const getJwtSecret = (secret) => new TextEncoder().encode(secret)

export const signToken = async (payload, secret) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('12h')
    .sign(getJwtSecret(secret))
}

export const requireAuth = async (c, next) => {
  const header = c.req.header('Authorization')
  if (!header?.startsWith('Bearer ')) {
    return c.json({ message: 'Unauthorized' }, 401)
  }

  const token = header.slice(7)
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(c.env.JWT_SECRET))

    const user = await c.env.DB.prepare(
      'SELECT id, first_name, last_name, email, role FROM users WHERE id = ?'
    )
      .bind(payload.sub)
      .first()

    if (!user) return c.json({ message: 'Unauthorized' }, 401)

    c.set('user', {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      displayName: `${user.first_name} ${user.last_name}`.trim() || user.email,
    })

    await next()
  } catch {
    return c.json({ message: 'Unauthorized' }, 401)
  }
}

export const requireRole = (...roles) =>
  async (c, next) => {
    const user = c.get('user')
    if (!user) return c.json({ message: 'Unauthorized' }, 401)
    if (!roles.includes(user.role)) return c.json({ message: 'Forbidden' }, 403)
    await next()
  }
