import bcrypt from 'bcryptjs'
import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'

const router = express.Router()

function isDatabaseReady(res) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'Databasen er ikke klar ennå' })
    return false
  }
  return true
}

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '')

router.post('/register', async (req, res) => {
  if (!isDatabaseReady(res)) {
    return
  }

  const email = normalizeEmail(req.body?.email)
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  const requestedRole = typeof req.body?.role === 'string' ? req.body.role.trim().toLowerCase() : 'reader'
  const role = ['reader', 'editor', 'admin'].includes(requestedRole) ? requestedRole : 'reader'

  if (!email || !password || password.length < 8) {
    return res.status(400).json({
      message: 'Ugyldig data. Email og passord (minst 8 tegn) er påkrevd.',
    })
  }

  try {
    const existingUser = await User.findOne({ email }).lean()
    if (existingUser) {
      return res.status(409).json({ message: 'Konto med denne emailen finnes allerede.' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const createdUser = await User.create({ email, passwordHash, role })

    return res.status(201).json({
      id: createdUser._id,
      email: createdUser.email,
      role: createdUser.role,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Serverfeil', error: error.message })
  }
})

router.post('/login', async (req, res) => {
  if (!isDatabaseReady(res)) {
    return
  }

  const email = normalizeEmail(req.body?.email)
  const password = typeof req.body?.password === 'string' ? req.body.password : ''

  if (!email || !password) {
    return res.status(400).json({ message: 'Email og passord er påkrevd.' })
  }

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    return res.status(500).json({ message: 'JWT_SECRET er ikke satt' })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Ugyldige innloggingsdetaljer.' })
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Ugyldige innloggingsdetaljer.' })
    }

    const token = jwt.sign({ sub: String(user._id), role: user.role }, jwtSecret, {
      expiresIn: '12h',
    })

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Serverfeil', error: error.message })
  }
})

export default router
