import express from 'express'
import { getRestaruantsList, getMenu } from '../controllers/restaurantController.js'

export const router = express.Router()

router.get('/', getRestaruantsList)
router.get('/:id/', getMenu)
