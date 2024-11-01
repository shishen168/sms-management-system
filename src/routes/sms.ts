import { Router } from 'express'
import { smsController } from '../controllers/sms'
import { authMiddleware, checkPermission } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.post('/send', checkPermission('sms:send'), smsController.sendSingle)
router.post('/batch', checkPermission('sms:send'), smsController.sendBatch)
router.get('/records', checkPermission('sms:view'), smsController.getRecords)

export default router