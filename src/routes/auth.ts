import { createAdmin, createUser, loginAdmin, loginUser } from '@controllers/auth'
import { Router } from 'express'

const router: Router = Router()

router.post('/createUser', createUser)
router.post('/loginUser', loginUser)
router.post('/createAdmin', createAdmin)
router.post('/loginAdmin', loginAdmin)

export default router
