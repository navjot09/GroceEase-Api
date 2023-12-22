import { getFeaturedProducts, getProduct, getProducts } from '@controllers/product'
import { authenticate } from '@middlewares/authentication'
import { Router } from 'express'

const router: Router = Router()
router.get('/', authenticate, getProducts)
router.get('/featured', authenticate, getFeaturedProducts)
router.get('/:id', authenticate, getProduct)
export default router
