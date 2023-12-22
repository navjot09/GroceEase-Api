import { getCartItems, getItinerary } from '@controllers/cart'
import { authenticate } from '@middlewares/authentication'

import { Router } from 'express'

const router: Router = Router()
router.get('/', authenticate, getCartItems)
router.get('/itinerary', authenticate, getItinerary)

export default router
