import express, { Router } from 'express'
import { createUser, loginUser } from '../controllers/auth'

const router: Router = express.Router()

router.post('/createUser', createUser)
router.post('/loginUser', loginUser)

export default router
