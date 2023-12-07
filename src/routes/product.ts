import { getFeaturedProducts, getProducts } from '@controllers/product'
import { authenticate } from '@middlewares/authentication'
import { Router } from 'express'

const router: Router = Router()
router.get('/', authenticate, getProducts)
router.get('/featured', authenticate, getFeaturedProducts)
export default router
