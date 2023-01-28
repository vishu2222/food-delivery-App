import express from 'express'
import { order } from '../controllers/ordersController.js'

export const router = express.Router()
router.post('/', order)

// router.get('/:id', getorderDetails)
// router.put('/:id', updateOrder)
// router.delete('/:id', deleteOrder)
