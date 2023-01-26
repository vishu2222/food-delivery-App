import express from 'express'
import { order } from '../controllers/ordersController.js'

export const router = express.Router()
router.post('/new', order)
