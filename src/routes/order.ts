import { getOrderDetails, getOrders, postOrder } from '@controllers/order'
import { authenticate } from '@middlewares/authentication'

import { Router } from 'express'

const router: Router = Router()

router.route('/').post(authenticate, postOrder).get(authenticate, getOrders)
router.get('/:id', authenticate, getOrderDetails)

export default router
