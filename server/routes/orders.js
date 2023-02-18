import express from 'express'
import { createOrder, getAllOrders, getOrderDetails, updateOrder } from '../controllers/orders.js'
import { validateCart } from '../middleware/validateCart.js'
import { auth } from '../middleware/auth.js'

export const router = express.Router()

router.post('/', auth, validateCart, createOrder)
router.get('/', auth, getAllOrders)
router.get('/:orderId', auth, getOrderDetails)
router.patch('/:orderId', auth, updateOrder) // need to add auth
