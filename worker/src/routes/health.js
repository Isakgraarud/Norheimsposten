import { Hono } from 'hono'

const health = new Hono()

health.get('/', (c) => c.json({ message: 'API is running', uptime: Date.now() }))

export default health
