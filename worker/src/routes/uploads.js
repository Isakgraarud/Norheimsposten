import { Hono } from 'hono'
import { requireAuth, requireRole } from '../middleware/auth.js'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
const MAX_SIZE = 5 * 1024 * 1024

const EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
}

const uploads = new Hono()

uploads.post('/', requireAuth, requireRole('editor', 'admin'), async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('image')

  if (!file || typeof file === 'string') {
    return c.json({ message: 'No image provided' }, 400)
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return c.json({ message: 'Invalid file type. Allowed: jpeg, png, webp, gif, avif' }, 400)
  }

  const buffer = await file.arrayBuffer()

  if (buffer.byteLength > MAX_SIZE) {
    return c.json({ message: 'File exceeds 5 MB limit' }, 413)
  }

  const ext = EXTENSIONS[file.type]
  const filename = `${Date.now()}-${crypto.randomUUID()}${ext}`

  await c.env.BUCKET.put(filename, buffer, {
    httpMetadata: { contentType: file.type },
  })

  const origin = new URL(c.req.url).origin
  const url = `${origin}/uploads/${filename}`

  return c.json({ url, filename, size: buffer.byteLength, mimeType: file.type }, 201)
})

export default uploads
