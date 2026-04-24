import express from 'express'
import mongoose from 'mongoose'
import { requireAuth, requireRole } from '../middleware/authMiddleware.js'
import Article from '../models/Article.js'

const router = express.Router()

function isDatabaseReady(res) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'Databasen er ikke klar ennå' })
    return false
  }
  return true
}

router.get('/', async (_req, res) => {
  if (!isDatabaseReady(res)) {
    return
  }

  try {
    const articles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(30)
      .lean()
    return res.json(articles)
  } catch (error) {
    return res.status(500).json({ message: 'Serverfeil', error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  if (!isDatabaseReady(res)) {
    return
  }

  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Ugyldig artikkel-id' })
  }

  try {
    const article = await Article.findOne({ _id: id, status: 'published' }).lean()

    if (!article) {
      return res.status(404).json({ message: 'Fant ikke artikkel' })
    }

    return res.json(article)
  } catch (error) {
    return res.status(500).json({ message: 'Serverfeil', error: error.message })
  }
})

router.post('/', requireAuth, requireRole('editor', 'admin'), async (req, res) => {
  if (!isDatabaseReady(res)) {
    return
  }

  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : ''
  const category = typeof req.body?.category === 'string' ? req.body.category.trim() : ''
  const ingress = typeof req.body?.ingress === 'string' ? req.body.ingress.trim() : ''
  const content = typeof req.body?.content === 'string' ? req.body.content.trim() : ''

  if (!title || !category || !content) {
    return res.status(400).json({
      message: 'Ugyldig data. "title", "category" og "content" er påkrevd.',
    })
  }

  try {
    const createdArticle = await Article.create({
      title,
      category,
      ingress,
      content,
      authorName: req.user.email,
      status: 'published',
      publishedAt: new Date(),
    })

    return res.status(201).json(createdArticle)
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: 'Ugyldig artikkeldata', error: error.message })
    }

    return res.status(500).json({ message: 'Serverfeil', error: error.message })
  }
})

export default router
