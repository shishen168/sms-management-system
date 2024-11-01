import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import { limiter, corsOptions, cspConfig, xssProtection } from '../middleware/security'
import { AppDataSource } from './database'
import cors from 'cors'

export const setupServer = async () => {
  const app = express()

  // Initialize database connection
  await AppDataSource.initialize()

  // Security middleware
  app.use(helmet())
  app.use(cors(corsOptions))
  app.use(compression())
  app.use(limiter)
  app.use(cspConfig)
  app.use(xssProtection)
  app.use(express.json({ limit: '10kb' })) // Limit request size

  // Trust proxy for secure cookies
  app.set('trust proxy', 1)

  return app
}