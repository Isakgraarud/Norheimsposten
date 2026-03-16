// routes/moviesRoute.js
import express from 'express'
import mongoose from 'mongoose'
import Movie from '../models/Movie.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().limit(10);
    console.log("Database-navn:", mongoose.connection.name); // Sjekker hvilken DB vi er i
    console.log("Data funnet:", movies); // Se i terminalen om dette er []
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Serverfeil', error: error.message });
  }
});

export default router