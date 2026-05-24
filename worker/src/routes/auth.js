import { Hono } from 'hono'
import { signToken } from '../middleware/auth.js'
import { hashPassword, verifyPassword } from '../utils/crypto.js'

const auth = new Hono()

auth.post('/register', async (c) => {
  const { firstName, lastName, email, password } = await c.req.json()

  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) {
    return c.json({ message: 'All fields are required' }, 400)
  }
  if (password.length < 8) {
    return c.json({ message: 'Password must be at least 8 characters' }, 400)
  }

  const normalizedEmail = email.toLowerCase().trim()
  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind(normalizedEmail)
    .first()
  if (existing) return c.json({ message: 'Email already in use' }, 409)

  const passwordHash = await hashPassword(password)
  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await c.env.DB.prepare(
    'INSERT INTO users (id, first_name, last_name, email, password_hash, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(id, firstName.trim(), lastName.trim(), normalizedEmail, passwordHash, 'reader', now, now)
    .run()

  return c.json(
    { id, _id: id, firstName: firstName.trim(), lastName: lastName.trim(), email: normalizedEmail, role: 'reader' },
    201
  )
})

auth.post('/login', async (c) => {
  const { email, password } = await c.req.json()

  if (!email?.trim() || !password) {
    return c.json({ message: 'Email and password are required' }, 400)
  }

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?')
    .bind(email.toLowerCase().trim())
    .first()

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return c.json({ message: 'Invalid credentials' }, 401)
  }

  const token = await signToken({ sub: user.id, role: user.role }, c.env.JWT_SECRET)

  return c.json({
    token,
    user: {
      id: user.id,
      _id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
    },
  })
})

export default auth
