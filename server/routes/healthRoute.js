import { Router } from 'express'

const router = Router()

router.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Hello from Express + MongoDB backend',
    stack: 'MERN',
    uptime: process.uptime(),
  })
})

export default router
