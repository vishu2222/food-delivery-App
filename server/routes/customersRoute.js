import express from 'express'
import { createOrder } from '../controllers/customersController.js'

export const router = express.Router()

router.post('/:customer_id', createOrder)
