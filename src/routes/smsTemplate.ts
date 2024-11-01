import { Router } from 'express'
import { smsTemplateController } from '../controllers/smsTemplate'
import { authMiddleware, checkPermission } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.post('/', checkPermission('template:manage'), smsTemplateController.create)
router.put('/:id', checkPermission('template:manage'), smsTemplateController.update)
router.delete('/:id', checkPermission('template:manage'), smsTemplateController.delete)
router.get('/', checkPermission('template:view'), smsTemplateController.getAll)
router.get('/:id', checkPermission('template:view'), smsTemplateController.getById)

export default router