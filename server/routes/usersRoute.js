import express from 'express'
import mongoose from 'mongoose'
import { requireAuth, requireRole } from '../middleware/authMiddleware.js'
import User from '../models/User.js'
import { composeUserDisplayName } from '../utils/userDisplayName.js'

const router = express.Router()

const ALLOWED_ROLES = ['reader', 'editor', 'admin']

function isDatabaseReady(res) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'Databasen er ikke klar ennå' })
    return false
  }
  return true
}

router.get('/', requireAuth, requireRole('admin'), async (_req, res) => {
  if (!isDatabaseReady(res)) {
    return
  }

  try {
    const users = await User.find({})
      .select('firstName lastName email role createdAt')
      .sort({ createdAt: -1 })
      .lean()

    return res.json(
      users.map((user) => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        displayName: composeUserDisplayName(user),
        createdAt: user.createdAt,
      }))
    )
  } catch (error) {
    return res.status(500).json({ message: 'Serverfeil', error: error.message })
  }
})

router.patch('/:id/role', requireAuth, requireRole('admin'), async (req, res) => {
  if (!isDatabaseReady(res)) {
    return
  }

  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Ugyldig bruker-id' })
  }

  if (String(req.user?.id) === String(id)) {
    return res.status(400).json({ message: 'Du kan ikke endre din egen rolle' })
  }

  const requestedRole =
    typeof req.body?.role === 'string' ? req.body.role.trim().toLowerCase() : ''

  if (!ALLOWED_ROLES.includes(requestedRole)) {
    return res.status(400).json({
      message: `Ugyldig rolle. Tillatte verdier: ${ALLOWED_ROLES.join(', ')}.`,
    })
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: requestedRole },
      { new: true, runValidators: true }
    )
      .select('firstName lastName email role')
      .lean()

    if (!updatedUser) {
      return res.status(404).json({ message: 'Fant ikke bruker' })
    }

    return res.json({
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role,
      displayName: composeUserDisplayName(updatedUser),
    })
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: 'Ugyldig brukerdata', error: error.message })
    }
    return res.status(500).json({ message: 'Serverfeil', error: error.message })
  }
})

export default router
