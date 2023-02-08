import express from 'express'
import { confirmOrder, getAllOrders, addMenuItem } from '../controllers/restaurantController'
import { updateMenuItem, deleteMenuItem } from '../controllers/restaurantController'
// import { getRestaruantsList, getMenu } from '../controllers/restaurantController.js'

export const router = express.Router()

router.put('/orders/:order_id', confirmOrder)
router.get('/orders', getAllOrders)
router.post('/menu', addMenuItem)
router.put('/menu/:item_id', updateMenuItem)
router.delete('/menu/:item_id', deleteMenuItem)

// router.get('/', getRestaruantsList)
// router.get('/:restaurant_id/menu', getMenu) // restaurantdetails and menu // not working with restaurant-id
