import { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import { expressCspHeader, INLINE, NONE, SELF } from 'express-csp-header'

// Rate limiting configuration
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

// CORS configuration
export const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

// CSP configuration
export const cspConfig = expressCspHeader({
  directives: {
    'default-src': [SELF],
    'script-src': [SELF, INLINE],
    'style-src': [SELF, INLINE],
    'img-src': [SELF, 'data:', 'https:'],
    'connect-src': [SELF],
    'frame-ancestors': [NONE],
    'form-action': [SELF]
  }
})

// XSS Protection middleware
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (typeof obj !== 'object') return obj
    return Object.keys(obj).reduce((acc: any, key) => {
      acc[key] = typeof obj[key] === 'string' 
        ? obj[key].replace(/[<>]/g, '') 
        : sanitize(obj[key])
      return acc
    }, Array.isArray(obj) ? [] : {})
  }

  req.body = sanitize(req.body)
  req.query = sanitize(req.query)
  req.params = sanitize(req.params)
  next()
}