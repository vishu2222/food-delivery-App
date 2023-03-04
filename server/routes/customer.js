import express from 'express'
import { addCustomerAddress, getCustomerAddress, getCustomerLocation } from '../controllers/customer.js'
import { auth } from '../middleware/auth.js'

export const router = express.Router()

router.post('/address', auth, addCustomerAddress)
router.get('/address', auth, getCustomerAddress)
router.post('/location', getCustomerLocation)
