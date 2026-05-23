import bcrypt from 'bcryptjs'
import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'
import { composeUserDisplayName } from '../utils/userDisplayName.js'

const router = express.Router()

function isDatabaseReady(res) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'Databasen er ikke klar ennå' })
    return false
  }
  return true
}

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '')
const normalizeName = (value) => (typeof value === 'string' ? value.trim() : '')

router.post('/register', async (req, res) => {
  if (!isDatabaseReady(res)) {
    return
  }

  const email = normalizeEmail(req.body?.email)
  const password = typeof req.body?.password === 'string' ? req.body.password : ''
  const firstName = normalizeName(req.body?.firstName)
  const lastName = normalizeName(req.body?.lastName)

  if (!firstName || !lastName || !email || !password || password.length < 8) {
    return res.status(400).json({
      message: 'Ugyldig data. Fornavn, etternavn, email og passord (minst 8 tegn) er påkrevd.',
    })
  }

  try {
    const existingUser = await User.findOne({ email }).lean()
    if (existingUser) {
      return res.status(409).json({ message: 'Konto med denne emailen finnes allerede.' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const createdUser = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role: 'reader',
    })
    const displayName = composeUserDisplayName(createdUser)

    return res.status(201).json({
      id: createdUser._id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      email: createdUser.email,
      role: createdUser.role,
      displayName,
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
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        displayName: composeUserDisplayName(user),
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Serverfeil', error: error.message })
  }
})

export default router
