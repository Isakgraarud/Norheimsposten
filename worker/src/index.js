import { Hono } from 'hono'
import { cors } from 'hono/cors'
import auth from './routes/auth.js'
import articles from './routes/articles.js'
import uploads from './routes/uploads.js'
import users from './routes/users.js'
import health from './routes/health.js'

const app = new Hono()

app.onError((err, c) => {
  console.error(err)
  return c.json({ message: err.message || 'Internal server error' }, 500)
})

app.use('*', async (c, next) => {
  const origins = c.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean)
  return cors({
    origin: origins?.length ? origins : '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })(c, next)
})

app.get('/', (c) => c.text('API is running'))

// Serve R2 uploads directly through the worker
app.get('/uploads/:filename', async (c) => {
  const object = await c.env.BUCKET.get(c.req.param('filename'))
  if (!object) return c.json({ message: 'Not found' }, 404)

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('Cache-Control', 'public, max-age=604800')

  return new Response(object.body, { headers })
})

app.route('/api/health', health)
app.route('/api/auth', auth)
app.route('/api/articles', articles)
app.route('/api/uploads', uploads)
app.route('/api/users', users)

export default app
