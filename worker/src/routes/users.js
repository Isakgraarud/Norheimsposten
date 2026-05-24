import { Hono } from 'hono'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { getUserDisplayName } from '../utils/displayName.js'

const VALID_ROLES = ['reader', 'editor', 'admin']

const users = new Hono()

users.get('/', requireAuth, requireRole('admin'), async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY created_at DESC'
  ).all()

  return c.json(
    results.map((u) => ({
      _id: u.id,
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      role: u.role,
      createdAt: u.created_at,
      displayName: getUserDisplayName(u),
    }))
  )
})

users.patch('/:id/role', requireAuth, requireRole('admin'), async (c) => {
  const id = c.req.param('id')
  const currentUser = c.get('user')

  if (id === currentUser.id) {
    return c.json({ message: 'Cannot change your own role' }, 400)
  }

  const { role } = await c.req.json()

  if (!VALID_ROLES.includes(role)) {
    return c.json({ message: `Role must be one of: ${VALID_ROLES.join(', ')}` }, 400)
  }

  const target = await c.env.DB.prepare('SELECT id FROM users WHERE id = ?').bind(id).first()
  if (!target) return c.json({ message: 'User not found' }, 404)

  const now = new Date().toISOString()
  await c.env.DB.prepare('UPDATE users SET role = ?, updated_at = ? WHERE id = ?')
    .bind(role, now, id)
    .run()

  const updated = await c.env.DB.prepare(
    'SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = ?'
  )
    .bind(id)
    .first()

  return c.json({
    _id: updated.id,
    id: updated.id,
    firstName: updated.first_name,
    lastName: updated.last_name,
    email: updated.email,
    role: updated.role,
    createdAt: updated.created_at,
    displayName: getUserDisplayName(updated),
  })
})

export default users
