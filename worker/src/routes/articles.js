import { Hono } from 'hono'
import { requireAuth, requireRole } from '../middleware/auth.js'

const articles = new Hono()

const fmt = (a) => ({
  _id: a.id,
  id: a.id,
  title: a.title,
  category: a.category,
  picture: a.picture,
  ingress: a.ingress,
  content: a.content,
  authorName: a.author_name,
  publishedAt: a.published_at,
  status: a.status,
  createdAt: a.created_at,
  updatedAt: a.updated_at,
})

articles.get('/', async (c) => {
  const category = c.req.query('category')

  const { results } = category
    ? await c.env.DB.prepare(
        "SELECT * FROM articles WHERE status = 'published' AND LOWER(category) LIKE LOWER(?) ORDER BY published_at DESC LIMIT 30"
      )
        .bind(`%${category}%`)
        .all()
    : await c.env.DB.prepare(
        "SELECT * FROM articles WHERE status = 'published' ORDER BY published_at DESC LIMIT 30"
      ).all()

  return c.json(results.map(fmt))
})

articles.get('/:id', async (c) => {
  const article = await c.env.DB.prepare(
    "SELECT * FROM articles WHERE id = ? AND status = 'published'"
  )
    .bind(c.req.param('id'))
    .first()

  if (!article) return c.json({ message: 'Article not found' }, 404)
  return c.json(fmt(article))
})

articles.post('/', requireAuth, requireRole('editor', 'admin'), async (c) => {
  const { title, category, content, ingress, picture } = await c.req.json()

  if (!title?.trim() || !category?.trim() || !content?.trim()) {
    return c.json({ message: 'title, category, and content are required' }, 400)
  }

  const user = c.get('user')
  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await c.env.DB.prepare(
    'INSERT INTO articles (id, title, category, picture, ingress, content, author_name, published_at, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(id, title.trim(), category.trim(), picture || null, ingress?.trim() || '', content.trim(), user.displayName, now, 'published', now, now)
    .run()

  const article = await c.env.DB.prepare('SELECT * FROM articles WHERE id = ?').bind(id).first()
  return c.json(fmt(article), 201)
})

articles.put('/:id', requireAuth, requireRole('editor', 'admin'), async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()

  const existing = await c.env.DB.prepare('SELECT id FROM articles WHERE id = ?').bind(id).first()
  if (!existing) return c.json({ message: 'Article not found' }, 404)

  const fields = []
  const values = []

  if ('title' in body) {
    if (!body.title?.trim()) return c.json({ message: 'title cannot be empty' }, 400)
    fields.push('title = ?'); values.push(body.title.trim())
  }
  if ('category' in body) {
    if (!body.category?.trim()) return c.json({ message: 'category cannot be empty' }, 400)
    fields.push('category = ?'); values.push(body.category.trim())
  }
  if ('content' in body) {
    if (!body.content?.trim()) return c.json({ message: 'content cannot be empty' }, 400)
    fields.push('content = ?'); values.push(body.content.trim())
  }
  if ('ingress' in body) {
    fields.push('ingress = ?'); values.push(body.ingress?.trim() || '')
  }
  if ('picture' in body) {
    fields.push('picture = ?'); values.push(body.picture || null)
  }

  if (fields.length === 0) return c.json({ message: 'No fields to update' }, 400)

  const now = new Date().toISOString()
  fields.push('updated_at = ?'); values.push(now)
  values.push(id)

  await c.env.DB.prepare(`UPDATE articles SET ${fields.join(', ')} WHERE id = ?`)
    .bind(...values)
    .run()

  const article = await c.env.DB.prepare('SELECT * FROM articles WHERE id = ?').bind(id).first()
  return c.json(fmt(article))
})

articles.delete('/:id', requireAuth, requireRole('admin'), async (c) => {
  const id = c.req.param('id')
  const article = await c.env.DB.prepare('SELECT * FROM articles WHERE id = ?').bind(id).first()
  if (!article) return c.json({ message: 'Article not found' }, 404)

  await c.env.DB.prepare('DELETE FROM articles WHERE id = ?').bind(id).run()
  return c.json({ message: 'Article deleted', article: fmt(article) })
})

export default articles
