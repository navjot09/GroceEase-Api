import { add, getProductQuantity, remove } from '@controllers/cartItem'
import { authenticate } from '@middlewares/authentication'

import { Router } from 'express'

const router: Router = Router()
router.get('/:productId', authenticate, getProductQuantity)
router.post('/:productId', authenticate, add)
router.delete('/:productId', authenticate, remove)

export default router
