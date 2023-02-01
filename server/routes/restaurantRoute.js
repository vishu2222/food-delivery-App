import express from 'express'
import { getRestaruantsList, getMenu } from '../controllers/restaurantController.js'

export const router = express.Router()

router.get('/', getRestaruantsList)
router.get('/:restaurant_id/menu', getMenu) // restaurantdetails and menu // not working with restaurant-id
