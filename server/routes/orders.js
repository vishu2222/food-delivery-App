import express from 'express'
import { createOrder, getAllOrders, getOrderDetails, updateOrder } from '../controllers/orders.js'
import { validateCart } from '../middleware/validateCart.js'

export const router = express.Router()

router.post('/', validateCart, createOrder)
router.get('/', getAllOrders)
router.get('/:orderId', getOrderDetails)
router.put('/:orderId', updateOrder)
