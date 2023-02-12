import { getOrderId, placeOrder, getAllCustomerOrders, getAllRestaurantOrders } from '../models/orders.js'
import { getItemPrices, fetchOrderDetails } from '../models/orders.js'
import { updateRestaurantConfirmation, updateDelivary, getItemNames } from '../models/orders.js'
import { getRestaurantsLocation, setDelivaryPartner, updatePickup } from '../models/orders.js'
import socket from '../sockets/sockets.js'

// create order example cart =  {"restaurantId":1, "addressId":1, "items":{"1":2, "2":3}}
export async function createOrder(req, res) {
  // 400 validations are in middleware
  try {
    const cart = req.body
    const orderTime = Date.now()
    const restaurantId = cart.restaurantId
    const addressId = cart.addressId
    const customerId = 1 // need to get it from middleware after authorization
    const clientCartItems = cart.items
    const itemIds = Object.keys(clientCartItems)

    // need to validate restaurantId, addressId for 404
    // dbcartItems example [ { item_id: 1, price: 100 }, { item_id: 2, price: 50 } ]
    const dbcartItems = await getItemPrices(itemIds, restaurantId)

    if (dbcartItems.length !== Object.keys(clientCartItems).length) {
      return res.status(404).json({ msg: 'some items dont belong to the restaurant' })
    }

    const totalAmount = dbcartItems.reduce((total, item) => {
      const quantity = clientCartItems[item.item_id]
      return total + item.price * quantity
    }, 0)

    await placeOrder(restaurantId, addressId, totalAmount, JSON.stringify(clientCartItems), orderTime, customerId)

    const orderId = await getOrderId(customerId, restaurantId)
    res.status(201).json({ orderId, msg: 'order placed, waiting for restaurant confirmation' })

    let notification = { type: 'new-order', restaurantId, order: { clientCartItems, orderId } } // better have another try catch here
    notifyRestaurant(notification) //
    notification = { msg: 'awaiting restaurant confirmation' }
    notifyCustomer(notification) //
  } catch (err) {
    console.log(err)
    return res.status(500).json({ msg: 'unable to place the order' })
  }
}

export async function getAllOrders(req, res) {
  try {
    if (req.headers.userrole === 'customer') {
      const customerId = 1 //
      const customerOrders = await getAllCustomerOrders(customerId)
      return res.json(customerOrders)
    }

    if (req.headers.userrole === 'restaurant') {
      const restaurantId = 1 //
      const restaurantOrders = await getAllRestaurantOrders(restaurantId)
      return res.json(restaurantOrders)
    }

    return res.sendStatus(401)
  } catch (err) {
    return res.status(500).json({ msg: 'unable to get orders' })
  }
}

export async function getOrderDetails(req, res) {
  try {
    const customerId = 1 // get it from auth middleware
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

async function addOrderItemNames(orderItems) {
  let itemNames = await getItemNames(Object.keys(orderItems))

  itemNames = itemNames.map((item) => {
    item.quantity = orderItems[item.item_id]
    return item
  })

  return itemNames
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
    res.status(500).json({ msg: 'unable to update order' })
  }
}

async function updateRestaurantsConfirmation(orderId, req, res) {
  // update options reject or accept
  const confirmation = req.body.confirmation
  const restaurantId = 1 //

  if (confirmation === 'reject') {
    const orderStatus = 'cancelled'
    const rowCount = await updateRestaurantConfirmation(orderId, orderStatus)
    if (rowCount < 1) return res.status(404).json({ msg: 'order not found' })
    res.json({ msg: 'order cancelled' })
    notifyCustomer({ msg: orderStatus })
    return
  }

  if (confirmation === 'accept') {
    const orderStatus = 'searching for delivery partner'
    const rowCount = await updateRestaurantConfirmation(orderId, orderStatus)
    if (rowCount < 1) return res.status(404).json({ msg: 'order not found' })
    res.json({ msg: 'order accepted' })

    notifyCustomer({ msg: orderStatus })
    assignDelivaryPartner(restaurantId, orderId)
    return
  }

  return res.status(400).json({ msg: 'invalid confirmation' })
}

async function assignDelivaryPartner(restaurantId, orderId) {
  try {
    const restaurantLocation = await getRestaurantsLocation(restaurantId)
    if (restaurantLocation.length === 0) throw new Error('restaurant not found')

    const partnerId = await findNearestDelivaryPartner(restaurantLocation)

    await setDelivaryPartner(orderId, partnerId)

    const orderStatus = 'awaiting pickup'

    notifyRestaurant({ type: 'update', orderStatus }) //
    notifyCustomer({ msg: orderStatus }) //
    notifyPartner({ msg: orderStatus, location: restaurantLocation[0] }) //
  } catch (error) {
    const orderStatus = 'cancelled'
    notifyRestaurant({ type: 'update', orderStatus }) //
    notifyCustomer({ msg: orderStatus }) //s
  }
}

async function findNearestDelivaryPartner(restaurantLocation) {
  // need to search and find from streaming data of partners locations
  // if not found cancell the order and update restaurant and customer
  const partnerId = 1
  return partnerId
}

async function updatePartnersConfirmation(orderId, req, res) {
  // update options pickup and delivary
  // validate orderId format, check if order status is not cancelled before proceeding
  const confirmation = req.body.confirmation
  if (confirmation === 'pickup') {
    const rowCount = await updatePickup(orderId)
    if (rowCount < 1) {
      return res.status(404).json({ msg: 'order not found' })
    }
    const orderStatus = 'awaiting delivary'
    res.json({ msg: 'pickup confirmed' })
    notifyRestaurant({ type: 'update', orderStatus }) //to
    notifyCustomer({ msg: orderStatus }) // to
    return
  }

  if (confirmation === 'delivered') {
    const rowCount = await updateDelivary(orderId)
    if (rowCount < 1) {
      return res.status(404).json({ msg: 'order not found' })
    }
    const orderStatus = 'delivered'
    res.json({ msg: 'delivery confirmed', status: 'success' })
    notifyCustomer({ msg: orderStatus }) // to
    return
  }
  return res.status(400).json({ msg: 'invalid confirmation' })
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
