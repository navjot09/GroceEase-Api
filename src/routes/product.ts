import { getProducts } from '@controllers/product'
import { authenticate } from '@middlewares/authentication'
import { Router } from 'express'

const router: Router = Router()
router.get('/', authenticate, getProducts)
export default router
