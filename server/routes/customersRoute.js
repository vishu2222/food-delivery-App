import express from 'express'
import { createOrder, getAllOrders, getOrderDetails } from '../controllers/customersController.js'
import { getRestaurantsList, getRestaurantsMenu } from '../controllers/customersController.js'

export const router = express.Router()

router.get('/restaurants', getRestaurantsList)
router.get('/restaurants/:restaurantId', getRestaurantsMenu)
router.post('/orders', createOrder)
router.get('/orders', getAllOrders)
router.get('/orders/:orderId', getOrderDetails)

// import { createOrder } from '../controllers/customersController.js'
// router.post('/:customer_id', createOrder)
