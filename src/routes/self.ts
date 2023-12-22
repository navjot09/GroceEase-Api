import { getMyDetails } from '@controllers/self'
import { authenticate } from '@middlewares/authentication'

import { Router } from 'express'

const router: Router = Router()

router.get('/', authenticate, getMyDetails)

export default router
