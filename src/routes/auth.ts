import { createUser, loginUser } from '@controllers/auth'
import { Router } from 'express'

const router: Router = Router()

router.post('/createUser', createUser)
router.post('/loginUser', loginUser)

export default router
