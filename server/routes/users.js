import express from 'express'
import { registerUser } from '../controllers/users.js'
import { validateCustomerCredentials } from '../middleware/validateCustomerCredentials.js'

export const router = express.Router()

router.post('/', validateCustomerCredentials, registerUser)
