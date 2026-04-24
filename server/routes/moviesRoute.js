// routes/moviesRoute.js
import express from 'express'
import mongoose from 'mongoose'
import Movie from '../models/Movie.js'

const router = express.Router()

function isDatabaseReady(res) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'Databasen er ikke klar ennå' })
    return false
  }
  return true
}

router.get('/', async (req, res) => {
  if (!isDatabaseReady(res)) {
    return
  }

  try {
    const movies = await Movie.find().limit(10).maxTimeMS(5000).lean()
    res.json(movies)
  } catch (error) {
    res.status(500).json({ message: 'Serverfeil', error: error.message })
  }
})

router.post('/', async (req, res) => {
  if (!isDatabaseReady(res)) {
    return
  }

  const rawTitle = req.body?.title
  const rawYear = req.body?.year
  const rawPoster = req.body?.poster
  const rawGenres = req.body?.genres
  const rawPlot = req.body?.plot

  const title = typeof rawTitle === 'string' ? rawTitle.trim() : ''
  const year = Number(rawYear)

  if (!title || Number.isNaN(year)) {
    return res.status(400).json({
      message: 'Ugyldig data. "title" og "year" er påkrevd.',
    })
  }

  const poster = typeof rawPoster === 'string' ? rawPoster.trim() : undefined
  const plot = typeof rawPlot === 'string' ? rawPlot.trim() : undefined

  let genres
  if (Array.isArray(rawGenres)) {
    genres = rawGenres
      .map((genre) => (typeof genre === 'string' ? genre.trim() : ''))
      .filter(Boolean)
  } else if (typeof rawGenres === 'string') {
    genres = rawGenres
      .split(',')
      .map((genre) => genre.trim())
      .filter(Boolean)
  }

  try {
    const createdMovie = await Movie.create({
      title,
      year,
      ...(poster ? { poster } : {}),
      ...(plot ? { plot } : {}),
      ...(genres?.length ? { genres } : {}),
    })

    res.status(201).json(createdMovie)
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({
        message: 'Ugyldig data for film',
        error: error.message,
      })
    }

    res.status(500).json({ message: 'Serverfeil', error: error.message })
  }
})

export default router