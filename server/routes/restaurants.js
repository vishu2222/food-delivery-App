import express from 'express'
import { getRestaurantsList, getRestaurantsMenu } from '../controllers/restaurants.js'
import { validateRestaurantId } from '../middleware/validateRestaurantId.js'

export const router = express.Router()

router.get('/', getRestaurantsList)
router.get('/:restaurantId', validateRestaurantId, getRestaurantsMenu)
