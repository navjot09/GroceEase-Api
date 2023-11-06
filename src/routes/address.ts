import { getAddress, getAddressById, postAddress, deleteAddress } from '@controllers/address'
import { authenticate } from '@middlewares/authentication'
import { Router } from 'express'

const router: Router = Router()

router.route('/').post(authenticate, postAddress).get(authenticate, getAddress)
router.route('/:id').get(authenticate, getAddressById).delete(authenticate, deleteAddress)

export default router
