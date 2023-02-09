import { getOrderId, placeOrder, getAllCustomerOrders, getAllRestaurantOrders } from '../models/orders.js'
import { getItemPrices, getOrderStatus, fetchOrderDetails, fetchDeliveryDetails } from '../models/orders.js'
import { updateRestaurantConfirmation, updateDelivary, getItemNames } from '../models/orders.js'
import { getRestaurantsLocation, setDelivaryPartner, updatePickup } from '../models/orders.js'
import socket from '../sockets/sockets.js'

// create order example cart =  {"restaurantId":1, "addressId":1, "items":{"1":2, "2":3}}
export async function createOrder(req, res) {
  try {
    const cart = req.body
    const orderTime = Date.now()
    const restaurantId = cart.restaurantId
    const addressId = cart.addressId
    const customerId = 1 // need to get it from middleware after authorization
    const clientCartItems = cart.items
    const itemIds = Object.keys(clientCartItems)

    // need to do other validations commented in validateCart middleware
    const dbcartItems = await getItemPrices(itemIds, restaurantId) // [ { item_id: 1, price: 100 }, { item_id: 2, price: 50 } ]

    if (dbcartItems.length !== Object.keys(clientCartItems).length) {
      return res.status(404).json({ err: 'items not found', msg: 'some items dont belong to the restaurant' })
    }

    const totalAmount = dbcartItems.reduce((total, item) => {
      const quantity = clientCartItems[item.item_id]
      return total + item.price * quantity
    }, 0)

    await placeOrder(restaurantId, addressId, totalAmount, JSON.stringify(clientCartItems), orderTime, customerId)

    const orderId = await getOrderId(customerId, restaurantId)
    res.status(201).json({ data: orderId, msg: 'order placed, waiting for restaurant confirmation' })

    let notification = { type: 'new-order', restaurantId, order: { clientCartItems, orderId } }
    notifyRestaurant(notification) // to
    notification = { msg: 'awaiting restaurant confirmation' }
    notifyCustomer(notification) // to
  } catch (err) {
    console.log(err)
    return res.status(500).json({ err: 'internal error', msg: 'unable to process the order' })
  }
}

export async function getAllOrders(req, res) {
  try {
    if (req.headers.userrole === 'customer') {
      const customerId = 1 // need to get from middleware
      const customerOrders = await getCustomerOrders(customerId)
      return res.json({ data: customerOrders, status: 'success' })
    }

    if (req.headers.userrole === 'restaurant') {
      const restaurantId = 1 // need to get from middleware
      const restaurantOrders = await getRestaurantOrders(restaurantId)
      return res.json({ data: restaurantOrders, status: 'success' })
    }

    return res.status(401).json({ err: 'unauthorized', msg: 'not permited to perform the action' })
  } catch (err) {
    return res.status(500).json({ err: 'internal error', msg: 'server error' })
  }
}

async function getCustomerOrders(customerId) {
  const orders = await getAllCustomerOrders(customerId)
  return orders
}

async function getRestaurantOrders(restaurantId) {
  const orders = await getAllRestaurantOrders(restaurantId)
  return orders
}

export async function getOrderDetails(req, res) {
  try {
    const customerId = 1 // get it from auth middleware
    const orderId = req.params.orderId // need to validate orderId format

    let response = await getOrderStatus(orderId, customerId)
    if (response.length === 0) {
      return res.status(404).json({ err: 'order not found', msg: 'order details not found' })
    }
    const orderStatus = response[0].order_status

    if (orderStatus === 'awaiting restaurant confirmation' || orderStatus === 'searching for delivery partner') {
      response = await fetchOrderDetails(orderId)
      let orderDetails = response[0]
      orderDetails = await addOrderItemNames(orderDetails)
      return res.json({ data: orderDetails, status: 'success' })
    }

    response = await fetchDeliveryDetails(orderId)
    let orderDetails = response[0]
    orderDetails = await addOrderItemNames(orderDetails)

    return res.json({ data: orderDetails, status: 'success' })
  } catch (error) {
    return res.status(500).json({ err: 'internal error', msg: 'unable to get order details' })
  }
}

async function addOrderItemNames(orderDetails) {
  const orderItems = orderDetails.order_items

  let itemNames = await getItemNames(Object.keys(orderItems))

  itemNames = itemNames.map((item) => {
    item.quantity = orderItems[item.item_id]
    return item
  })

  orderDetails.order_items = itemNames
  return orderDetails
}

export async function updateOrder(req, res) {
  const orderId = req.params.orderId // need to validate orderId(400) and validate if orderId  exists(404)
  try {
    if (req.headers.userrole === 'deliverypartner') {
      await updatePartnersConfirmation(orderId, req, res)
      return
    }

    if (req.headers.userrole === 'restaurant') {
      await updateRestaurantsConfirmation(orderId, req, res)
      return
    }
  } catch (error) {
    res.status(500).json({ err: 'internal error', msg: 'unable to update order' })
  }
}

async function updateRestaurantsConfirmation(orderId, req, res) {
  const confirmation = req.body.confirmation
  const restaurantId = 1 //

  if (confirmation === 'reject') {
    const orderStatus = 'cancelled'
    const rowCount = await updateRestaurantConfirmation(orderId, orderStatus)
    if (rowCount < 1) return res.status(404).json({ err: 'order not found', msg: 'order not found' })
    res.json({ msg: 'order cancelled', status: 'success' })
    notifyCustomer({ msg: orderStatus })
    return
  }

  if (confirmation === 'accept') {
    const orderStatus = 'searching for delivery partner'
    const rowCount = await updateRestaurantConfirmation(orderId, orderStatus)
    if (rowCount < 1) return res.status(404).json({ err: 'order not found', msg: 'order not found' })
    res.json({ msg: 'order accepted', status: 'success' })

    notifyCustomer({ msg: orderStatus })
    await assignDelivaryPartner(restaurantId, orderId)
    return
  }

  return res.status(400).json({ err: 'bad request', msg: 'invalid confirmation' })
}

async function assignDelivaryPartner(restaurantId, orderId) {
  try {
    const partnerId = 1 // needs to search and find
    const restaurantLocation = await getRestaurantsLocation(restaurantId)
    if (restaurantLocation.length === 0) throw new Error('restaurant not found')

    await setDelivaryPartner(orderId, partnerId)
    const orderStatus = 'awaiting pickup'

    notifyRestaurant({ type: 'update', orderStatus }) // to
    notifyCustomer({ msg: orderStatus }) // to
    notifyPartner({ msg: orderStatus, location: restaurantLocation[0] }) // to
  } catch (error) {
    const orderStatus = 'cancelled'
    notifyRestaurant({ type: 'update', orderStatus }) //to
    notifyCustomer({ msg: orderStatus }) // to
  }
}

// const partnerId = findNearestDelivaryPartner(restaurantLocation)
// async function findNearestDelivaryPartner(restaurantLocation) {
// }

async function updatePartnersConfirmation(orderId, req, res) {
  // update options pickup and delivary
  const confirmation = req.body.confirmation
  if (confirmation === 'pickup') {
    const rowCount = await updatePickup(orderId)
    if (rowCount < 1) {
      return res.status(404).json({ err: 'order not found', msg: 'order not found' })
    }
    const orderStatus = 'awaiting delivary'
    res.json({ msg: 'pickup confirmed', status: 'success' })
    notifyRestaurant({ type: 'update', orderStatus }) //to
    notifyCustomer({ msg: orderStatus }) // to
    return
  }

  if (confirmation === 'delivered') {
    const rowCount = await updateDelivary()
    if (rowCount < 1) {
      return res.status(404).json({ err: 'order not found', msg: 'order not found' })
    }
    const orderStatus = 'delivered'
    res.json({ msg: 'delivery confirmed', status: 'success' })
    notifyRestaurant({ type: 'update', orderStatus }) //to
    notifyCustomer({ msg: orderStatus }) // to
    return
  }
  return res.status(400).json({ err: 'bad request', msg: 'invalid confirmation' })
}

// notifications
function notifyRestaurant(notification) {
  const io = socket.get()
  if (notification.type === 'new-order') {
    io.emit('new-order', notification.order) // io.to(socketid of restaurant)
  }
  if (notification.type === 'update') {
    io.emit('restaurant-update', notification.orderStatus) //
  }
}

function notifyCustomer(notification) {
  const io = socket.get()
  io.emit('customer-update', notification.msg) //
}

function notifyPartner(notification) {
  const io = socket.get()
  io.emit('partner-update', notification.msg) //
}
