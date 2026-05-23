import express from 'express'
import multer from 'multer'
import { requireAuth, requireRole } from '../middleware/authMiddleware.js'
import { uploadImage } from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.post(
  '/',
  requireAuth,
  requireRole('editor', 'admin'),
  (req, res) => {
    uploadImage.single('image')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ message: 'Bildet er for stort (maks 5 MB).' })
        }
        return res.status(400).json({ message: err.message || 'Opplasting feilet' })
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Ingen fil mottatt' })
      }

      return res.status(201).json({
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename,
        size: req.file.size,
        mimeType: req.file.mimetype,
      })
    })
  }
)

export default router
