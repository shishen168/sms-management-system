import { Router } from 'express'
import { contactGroupController } from '../controllers/contactGroup'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.get('/', contactGroupController.getGroups)
router.post('/', contactGroupController.createGroup)
router.put('/:id', contactGroupController.updateGroup)
router.delete('/:id', contactGroupController.deleteGroup)
router.post('/:id/contacts', contactGroupController.addContactsToGroup)
router.delete('/:id/contacts', contactGroupController.removeContactsFromGroup)
router.get('/:id/contacts', contactGroupController.getGroupContacts)

export default router