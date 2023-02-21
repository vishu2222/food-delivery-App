import { getOrderId, placeOrder, getAllCustomerOrders, getAllRestaurantOrders } from '../../models/orders.js'
import { getItemPrices, fetchOrderDetails, getAllPartnersOrders, getOrder } from '../../models/orders.js'
import { updateRestaurantConfirmation, updateDelivery, getCustomerId } from '../../models/orders.js'
import { getRestaurantDetails, assignPartner, updatePickup, getOrderAmount } from '../../models/orders.js'
import { notifyPartner, notifyRestaurant, notifyCustomer } from './notifications.js'
import { validateOrderUpdate } from './validateOrderUpdate.js'
import { addOrderItemNames } from './addOrderItemNames.js'
import { sendNewOrderNotification } from './notifications.js'

// create order example cart =  {"restaurantId":1, "addressId":1, "items":{"1":2, "2":3}}
export async function createOrder(req, res) {
  try {
    const cart = req.body
    const orderTime = Date.now()
    const restaurantId = cart.restaurantId
    const addressId = cart.addressId
    const customerId = req.customerId
    let clientCartItems = cart.items
    const itemIds = Object.keys(clientCartItems)

    // dbcartItems example [ { item_id: 1, price: 100 }, { item_id: 2, price: 50 } ]
    const dbcartItems = await getItemPrices(itemIds, restaurantId)

    if (dbcartItems.length !== Object.keys(clientCartItems).length) {
      return res.status(404).json({
        msg: 'some items dont belong to the restaurant or restaurant not found'
      })
    }

    const totalAmount = dbcartItems.reduce((total, item) => {
      const quantity = clientCartItems[item.item_id]
      return total + item.price * quantity
    }, 0)

    await placeOrder(restaurantId, addressId, totalAmount, JSON.stringify(clientCartItems), orderTime, customerId)
    const orderId = await getOrderId(customerId, restaurantId)

    res.status(201).json({
      orderId,
      msg: 'order placed, waiting for restaurant confirmation'
    })

    sendNewOrderNotification(clientCartItems, orderTime, totalAmount, restaurantId, orderId)
  } catch (err) {
    if (err.code === '23503' && err.table === 'orders') {
      // in db fk constraint gets voilated when invalid address is given
      // move to model
      return res.status().json({ msg: 'given address id not found' })
    }

    console.log(err)
    return res.status(500).json({ msg: 'unable to place the order' })
  }
}

// update order by restaurant or delivarypartner
export async function updateOrder(req, res) {
  const orderId = req.params.orderId // need to validate orderId(400) and validate if orderId  exists(404)

  try {
    if (req.userRole === 'delivery_partner') {
      await updatePartnersConfirmation(orderId, req, res)
      return
    }

    if (req.userRole === 'restaurant') {
      await updateRestaurantsConfirmation(orderId, req, res)
      return
    }

    res.status(400).json({ msg: 'invalid user' })
  } catch (error) {
    res.status(500).json({ msg: 'unable to update order' })
  }
}

async function updateRestaurantsConfirmation(orderId, req, res) {
  try {
    const orderStatusUpdate = req.body.status
    const restaurantId = req.restaurantId

    const order = await getOrder(orderId)
    const currentStatus = order.status

    const isUpdateValid = validateOrderUpdate(orderStatusUpdate, currentStatus, 'restaurant', req, res)
    if (isUpdateValid === 'updateNotAllowed') return

    await updateRestaurantConfirmation(orderId, orderStatusUpdate)
    res.json({ msg: orderStatusUpdate })

    const customerId = await getCustomerId(orderId) // get it from previous query getOrder
    notifyCustomer({ type: 'update', orderStatus: orderStatusUpdate, customerId })

    if (orderStatusUpdate !== 'restaurant rejected') {
      assignDeliveryPartner(restaurantId, orderId)
    }
  } catch (error) {
    if (error.message === 'orderNotFound') {
      return res.status(404).json({ msg: 'order not found' })
    }
    //
  }
}

async function assignDeliveryPartner(restaurantId, orderId) {
  try {
    const restaurantDetails = await getRestaurantDetails(restaurantId)
    const partnerId = await findNearestDeliveryPartner(restaurantDetails)

    await assignPartner(orderId, partnerId)

    const orderStatus = 'awaiting pickup'
    const orderAmount = await getOrderAmount(orderId)

    const partnerNotification = {
      type: 'pickup',
      restaurant: restaurantDetails[0],
      status: orderStatus,
      orderId,
      orderAmount,
      partnerId
    }

    const customerId = await getCustomerId(orderId)
    console.log('orderStatus:', orderStatus, 'customerId:', customerId)

    notifyPartner(partnerNotification)
    notifyRestaurant({ type: 'update', orderId, orderStatus, restaurantId })
    notifyCustomer({ type: 'update', orderStatus, customerId })
  } catch (error) {
    if (error.message === 'orderNotFound') {
      //
    }
    // need to retry before cancelling
    const orderStatus = 'cancelled'
    // notifyRestaurant({ type: 'update', orderStatus })
    // notifyCustomer({ type: 'update', orderStatus })
  }
}

async function findNearestDeliveryPartner(restaurantDetails) {
  // need to search and find from streaming data of partners locations
  // if not found make few retry attempts and cancell the order and update restaurant and customer
  const partnerId = 1
  return partnerId
}

async function updatePartnersConfirmation(orderId, req, res) {
  try {
    const orderStatusUpdate = req.body.status

    const orderDetails = await getOrder(orderId)
    const currentStatus = orderDetails.status

    const isUpdateValid = validateOrderUpdate(orderStatusUpdate, currentStatus, 'partner', req, res)
    if (isUpdateValid === 'updateNotAllowed') return

    await updateDelivery(orderId, orderStatusUpdate)
    res.json({ msg: orderStatusUpdate })

    notifyCustomer({ type: 'update', orderStatus: orderStatusUpdate, customerId: orderDetails.customer_id })
    if (orderStatusUpdate === 'awaiting delivery') {
      notifyRestaurant({
        type: 'update',
        orderStatus: orderStatusUpdate,
        restaurantId: orderDetails.restaurant_id,
        orderId
      })
    }
  } catch (error) {
    if (error.message === 'orderNotFound') {
      return res.status(404).json({ msg: 'order not found' })
    }
    res.sendStatus(500)
  }
}

// getAllOrders
export async function getAllOrders(req, res) {
  try {
    if (req.userRole === 'customer') {
      const customerId = req.customerId
      const customerOrders = await getAllCustomerOrders(customerId)
      return res.json(customerOrders)
    }

    if (req.userRole === 'restaurant') {
      const restaurantId = req.restaurantId

      let restaurantOrders = await getAllRestaurantOrders(restaurantId)

      for (let order of restaurantOrders) {
        order.order_items = await addOrderItemNames(order.order_items)
      }

      return res.json(restaurantOrders)
    }

    if (req.userRole === 'delivery_partner') {
      const partnerId = req.partnerId
      const partnersOrders = await getAllPartnersOrders(partnerId)

      return res.json(partnersOrders)
    }

    return res.sendStatus(401)
  } catch (err) {
    return res.status(500).json({ msg: 'unable to get orders' })
  }
}

// getOrderDetails
export async function getOrderDetails(req, res) {
  try {
    // const customerId = req.customerId
    const orderId = req.params.orderId // need to validate orderId format

    let orderDetails = await fetchOrderDetails(orderId)

    if (orderDetails.length === 0) {
      return res.status(404).json({ msg: 'order details not found' })
    }

    orderDetails = orderDetails[0]
    orderDetails.order_items = await addOrderItemNames(orderDetails.order_items)

    return res.json(orderDetails)
  } catch (error) {
    return res.status(500).json({ msg: 'unable to get order details' })
  }
}
