import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const getBearerToken = (headerValue = '') => {
  if (!headerValue.startsWith('Bearer ')) {
    return ''
  }
  return headerValue.slice(7).trim()
}

export const requireAuth = async (req, res, next) => {
  const token = getBearerToken(req.headers.authorization)

  if (!token) {
    return res.status(401).json({ message: 'Manglende innloggingstoken' })
  }

  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    return res.status(500).json({ message: 'JWT_SECRET er ikke satt' })
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)
    const user = await User.findById(decoded.sub).select('email role').lean()

    if (!user) {
      return res.status(401).json({ message: 'Ugyldig bruker' })
    }

    req.user = {
      id: String(decoded.sub),
      email: user.email,
      role: user.role,
    }
    return next()
  } catch (_error) {
    return res.status(401).json({ message: 'Ugyldig eller utløpt token' })
  }
}

export const requireRole =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Innlogging kreves' })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Ingen tilgang til denne handlingen' })
    }

    return next()
  }
