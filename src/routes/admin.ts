import { Router } from 'express'
import { adminController } from '../controllers/admin'
import { authMiddleware, checkRole } from '../middleware/auth'

const router = Router()

// 所有管理路由都需要管理员权限
router.use(authMiddleware, checkRole('admin'))

router.get('/users', adminController.getUsers)
router.patch('/users/:userId/toggle-status', adminController.toggleUserStatus)
router.post('/users/assign-role', adminController.assignRole)

export default router