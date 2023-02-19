import { getOrderId, placeOrder, getAllCustomerOrders, getAllRestaurantOrders } from '../models/orders.js'
import { getItemPrices, fetchOrderDetails, getAllPartnersOrders } from '../models/orders.js'
import { updateRestaurantConfirmation, updateDelivery, getItemNames } from '../models/orders.js'
import { getRestaurantDetails, assignPartner, updatePickup, getOrderAmount } from '../models/orders.js'
import socket from '../sockets.js'

// create order example cart =  {"restaurantId":1, "addressId":1, "items":{"1":2, "2":3}}
export async function createOrder(req, res) {
  // 400 validations are moved to middleware
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
      return res.status(404).json({ msg: 'given address id not found' })
    }

    console.log(err)
    return res.status(500).json({ msg: 'unable to place the order' })
  }
}

// helper function
async function addOrderItemNames(orderItems) {
  let itemNames = await getItemNames(Object.keys(orderItems))

  itemNames = itemNames.map((item) => {
    item.quantity = orderItems[item.item_id]
    return item
  })

  return itemNames
}

// helper function
async function sendNewOrderNotification(cartItems, order_time, totalAmount, restaurantId, order_id) {
  cartItems = await addOrderItemNames(cartItems)
  cartItems = {
    order_time,
    order_items: cartItems,
    total_price: totalAmount,
    status: 'awaiting restaurant confirmation'
  }

  let notification = {
    type: 'new-order',
    restaurantId,
    order: { order_id, ...cartItems }
  }
  notifyRestaurant(notification)
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
    const orderStatus = req.body.status
    const restaurantId = req.restaurantId

    if (orderStatus === 'restaurant rejected') {
      const rowCount = await updateRestaurantConfirmation(orderId, orderStatus)
      if (rowCount < 1) return res.status(404).json({ msg: 'order not found' })
      res.json({ msg: orderStatus })
      notifyCustomer({ msg: orderStatus })
      return
    }

    if (orderStatus === 'searching for delivery partner') {
      const rowCount = await updateRestaurantConfirmation(orderId, orderStatus)
      if (rowCount < 1) return res.status(404).json({ msg: 'order not found' })
      res.json({ msg: orderStatus })

      notifyCustomer({ msg: orderStatus })
      assignDeliveryPartner(restaurantId, orderId)
      return
    }

    return res.status(400).json({ msg: 'invalid order status' })
  } catch (error) {
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

    const notification = {
      type: 'pickup',
      restaurant: restaurantDetails[0],
      status: orderStatus,
      orderId,
      total_price: orderAmount
    }

    notifyPartner(notification)
    notifyRestaurant({ type: 'update', orderStatus })
    notifyCustomer({ msg: orderStatus })
  } catch (error) {
    // need to retry before cancelling
    const orderStatus = 'cancelled'
    notifyRestaurant({ type: 'update', orderStatus })
    notifyCustomer({ msg: orderStatus })
  }
}

async function findNearestDeliveryPartner(restaurantDetails) {
  // need to search and find from streaming data of partners locations
  // if not found make few retry attempts and cancell the order and update restaurant and customer
  const partnerId = 1
  return partnerId
}

async function updatePartnersConfirmation(orderId, req, res) {
  // validate orderId format, check if order status is not cancelled before proceeding
  const orderStatus = req.body.status

  if (orderStatus === 'awaiting delivery') {
    const rowCount = await updatePickup(orderId)
    if (rowCount < 1) {
      return res.status(404).json({ msg: 'order not found' })
    }

    res.json({ msg: orderStatus })
    notifyRestaurant({ type: 'update', orderStatus })
    notifyCustomer({ msg: orderStatus })
    return
  }

  if (orderStatus === 'delivered') {
    const rowCount = await updateDelivery(orderId)
    if (rowCount < 1) {
      return res.status(404).json({ msg: 'order not found' })
    }

    res.json({ msg: orderStatus })
    notifyCustomer({ msg: orderStatus })
    return
  }
  return res.status(400).json({ msg: 'invalid confirmation' })
}

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

// helper function  notifications

function notifyPartner(notification) {
  try {
    const io = socket.get()
    if (notification.type === 'pickup') {
      io.emit('partner-update', {
        orderStatus: notification.status,
        ...notification.restaurant,
        orderId: notification.orderId
      })
    }
  } catch (err) {
    //
  }
}

function notifyRestaurant(notification) {
  try {
    const io = socket.get()

    if (notification.type === 'new-order') {
      io.emit('new-order', notification.order)
    }

    if (notification.type === 'update') {
      io.emit('restaurant-update', notification.orderStatus) //
    }
  } catch (err) {
    //
  }
}

function notifyCustomer(notification) {
  try {
    const io = socket.get()
    io.emit('customer-update', notification.msg)
  } catch (err) {
    //
  }
}

export async function getOrderDetails(req, res) {
  try {
    const customerId = req.customerId
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
