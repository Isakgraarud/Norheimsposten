import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import articlesRoute from './routes/articlesRoute.js'
import authRoute from './routes/authRoute.js'
import connectDB from './config/db.js'
import healthRoute from './routes/healthRoute.js'
import uploadsRoute from './routes/uploadsRoute.js'
import usersRoute from './routes/usersRoute.js'
import { UPLOAD_DIR } from './middleware/uploadMiddleware.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5001

const corsOptions = process.env.ALLOWED_ORIGINS
  ? { origin: process.env.ALLOWED_ORIGINS.split(',') }
  : {}

app.use(cors(corsOptions))
app.use(express.json())
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }))

app.get('/', (_req, res) => {
  res.send('API is running')
})

app.use('/api/health', healthRoute)
app.use('/api/auth', authRoute)
app.use('/api/articles', articlesRoute)
app.use('/api/uploads', uploadsRoute)
app.use('/api/users', usersRoute)

const startServer = async () => {
  await connectDB()

  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

startServer()