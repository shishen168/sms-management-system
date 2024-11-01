import { Router } from 'express'
import { authController } from '../controllers/auth'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.post('/register', authController.register)
router.get('/captcha', authController.generateCaptcha)

export default router