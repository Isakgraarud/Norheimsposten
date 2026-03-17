import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import connectDB from './config/db.js'
import healthRoute from './routes/healthRoute.js'
import moviesRoute from './routes/moviesRoute.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.send('API is running')
})

app.use('/api/health', healthRoute)
app.use('/api/movies', moviesRoute)

const startServer = async () => {
  await connectDB()

  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

startServer()