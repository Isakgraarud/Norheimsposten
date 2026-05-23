import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import articlesRoute from './routes/articlesRoute.js'
import authRoute from './routes/authRoute.js'
import connectDB from './config/db.js'
import healthRoute from './routes/healthRoute.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5001

const corsOptions = process.env.ALLOWED_ORIGINS
  ? { origin: process.env.ALLOWED_ORIGINS.split(',') }
  : {}

app.use(cors(corsOptions))
app.use(express.json())

app.get('/', (_req, res) => {
  res.send('API is running')
})

app.use('/api/health', healthRoute)
app.use('/api/auth', authRoute)
app.use('/api/articles', articlesRoute)

const startServer = async () => {
  await connectDB()

  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

startServer()