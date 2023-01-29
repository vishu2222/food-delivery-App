import express from 'express'
import { createOrder } from '../controllers/ordersController.js'

export const router = express.Router()
router.post('/', createOrder)

// router.get('/:id', getorderDetails)
// router.put('/:id', updateOrder)
// router.delete('/:id', deleteOrder)
