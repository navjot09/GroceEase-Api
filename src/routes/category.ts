import { getCategories, getCategoryDetails } from '@controllers/category'
import { authenticate } from '@middlewares/authentication'

import { Router } from 'express'

const router: Router = Router()

router.get('/', authenticate, getCategories)
router.get('/:id', authenticate, getCategoryDetails)

export default router
