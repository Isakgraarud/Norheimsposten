import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth.js'

const comments = new Hono()

const fmt = (c) => ({
  id: c.id,
  articleId: c.article_id,
  userId: c.user_id,
  authorName: c.author_name,
  body: c.body,
  createdAt: c.created_at,
})

comments.get('/:articleId/comments', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM comments WHERE article_id = ? ORDER BY created_at ASC'
  )
    .bind(c.req.param('articleId'))
    .all()

  return c.json(results.map(fmt))
})

comments.post('/:articleId/comments', requireAuth, async (c) => {
  const articleId = c.req.param('articleId')

  const article = await c.env.DB.prepare(
    "SELECT id FROM articles WHERE id = ? AND status = 'published'"
  )
    .bind(articleId)
    .first()

  if (!article) return c.json({ message: 'Article not found' }, 404)

  const { body } = await c.req.json()
  if (!body?.trim()) return c.json({ message: 'body is required' }, 400)

  const user = c.get('user')
  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await c.env.DB.prepare(
    'INSERT INTO comments (id, article_id, user_id, author_name, body, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  )
    .bind(id, articleId, user.id, user.displayName, body.trim(), now)
    .run()

  const comment = await c.env.DB.prepare('SELECT * FROM comments WHERE id = ?').bind(id).first()
  return c.json(fmt(comment), 201)
})

comments.delete('/:articleId/comments/:commentId', requireAuth, async (c) => {
  const { articleId, commentId } = c.req.param()
  const user = c.get('user')

  const comment = await c.env.DB.prepare(
    'SELECT * FROM comments WHERE id = ? AND article_id = ?'
  )
    .bind(commentId, articleId)
    .first()

  if (!comment) return c.json({ message: 'Comment not found' }, 404)

  if (comment.user_id !== user.id && user.role !== 'admin') {
    return c.json({ message: 'Forbidden' }, 403)
  }

  await c.env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(commentId).run()
  return c.json({ message: 'Comment deleted' })
})

export default comments