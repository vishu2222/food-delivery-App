import express from 'express'
import { registerUser, loginUser } from '../controllers/userController.js'

export const router = express.Router()

router.post('/', registerUser)
router.post('/me', loginUser)
