import { getRestaruants, getMenu, getItemPrices, placeOrder, getOrderId } from '../models/customerModel.js'
import { getDelivaryPartner, getItemNames, getRestaruantName, getOrders } from '../models/customerModel.js'
import { fetchOrderDetails } from '../models/customerModel.js'
import { validateCart, validateRestaurantId } from '../services/customerValidateCart.js'
import { formatTime } from '../utlities/formateTime.js'
import socket from '../sockets/sockets.js'

export async function getRestaurantsList(req, res) {
  try {
    let restaurants = await getRestaruants()

    restaurants = restaurants.map((restaurant) => {
      const start_time = formatTime(restaurant.start_time)
      const close_time = formatTime(restaurant.close_time)
      return { ...restaurant, start_time, close_time }
    })

    return res.json({ data: restaurants, status: 'success' })
  } catch (err) {
    return res.status(500).json({ err: 'internal server error', msg: 'unable to get restaurants' })
  }
}

export async function getRestaurantsMenu(req, res) {
  try {
    const restaurantId = req.params.restaurantId

    const [status, err, msg] = await validateRestaurantId(restaurantId)
    if (err) {
      return res.status(status).json({ err, msg })
    }

    const menu = await getMenu(restaurantId)
    return res.json({ data: menu, status: 'success' })
  } catch (error) {
    res.status(500).json({ err: 'internal server error', msg: 'unable to get menu' })
  }
}

// create order example cart =  {"restaurantId":1, "addressId":1, "items":{"1":2, "2":3}}
export async function createOrder(req, res) {
  try {
    const cart = req.body
    const orderTime = Date.now()
    const restaurantId = cart.restaurantId
    const addressId = cart.addressId
    const customerId = 1 // need to get it from middleware after authorization

    // q. where should the validateCart be present as per MVC structure? // validateCart has db queries as well

    const [status, err, msg] = await validateCart(cart, customerId)
    if (err) return res.status(status).json({ err, msg })

    const clientCartItems = cart.items
    const itemIds = Object.keys(clientCartItems)
    const dbcartItems = await getItemPrices(itemIds, restaurantId) // [ { item_id: 1, price: 100 }, { item_id: 2, price: 50 } ]

    // q. should the below validation be done in validateCart()? but require re-quering.
    if (dbcartItems.length !== Object.keys(clientCartItems).length) {
      return res.status(404).json({ err: 'items not found', msg: 'some items dont belong to the restaurant' })
    }

    const totalAmount = dbcartItems.reduce((total, item) => {
      const quantity = clientCartItems[item.item_id]
      return total + item.price * quantity
    }, 0)

    await placeOrder(restaurantId, addressId, totalAmount, JSON.stringify(clientCartItems), orderTime, customerId)
    const orderId = await getOrderId(customerId, restaurantId)
    notifyRestaurant(restaurantId, clientCartItems, orderId)

    return res.status(201).json({ data: orderId, msg: 'order placed, waiting for restaurant confirmation' })
  } catch (err) {
    return res.status(500).json({ err: 'internal error', msg: 'unable to process the order' })
  }
}

// helper function
function notifyRestaurant(restaurantId, orderItems, orderId) {
  const io = socket.get()
  const newOrder = { orderId, orderItems }
  io.emit('new-order', newOrder) // io.to(socketid of restaurant)
}

export async function getOrderDetails(req, res) {
  try {
    const customerId = 1 // get it from auth middleware
    const orderId = req.params.orderId // need to validate orderId format
    const response = await fetchOrderDetails(orderId, customerId)
    // example response = [{order_id: 1,  order_items: { 1: 2, 2: 3 }, order_time: 2023-02-07T07:23:28.861Z,
    // delivary_time: null, total_price: 350, restaurant_confirmed: false, partner_assigned: false,
    // order_pickedup: false, delivary_status: 'not initiated', address_id: 1, restaurant_id: 1, partner_id: null}]

    if (response.length === 0) {
      res.status(404).json({ err: 'order not found', msg: 'order not found' })
    }

    let orderDetails = response[0]

    orderDetails = changeTimeFormat(orderDetails)
    orderDetails = await addOrderItems(orderDetails)
    orderDetails = await addRestaurantName(orderDetails)
    const orderState = await findOrderState(orderDetails)
    // can delete unwanted orderdetails here

    return res.json({ orderDetails, orderState })
  } catch (error) {
    return res.status(500).json({ err: 'internal error', msg: 'unable to process the order' })
  }
}

// helper function
async function addRestaurantName(orderDetails) {
  const restaurantId = orderDetails.restaurant_id
  const response = await getRestaruantName(restaurantId)
  const restaurantName = response[0].restaurant_name
  orderDetails.restaurantName = restaurantName
  return orderDetails
}

// helper function
async function addOrderItems(orderDetails) {
  // getting item names from itemIds
  // itemNames: { item_id: 1, item_name: 'item1' }
  // orderItems { '1': 2, '2': 3 }
  const orderItems = orderDetails.order_items

  let itemNames = await getItemNames(Object.keys(orderItems))

  itemNames = itemNames.map((item) => {
    item.quantity = orderItems[item.item_id]
    return item
  })

  orderDetails.order_items = itemNames
  return orderDetails
}

// helper function
function changeTimeFormat(orderDetails) {
  orderDetails['order_time'] = formatTime(orderDetails['order_time'])

  if (orderDetails['delivary_status'] === 'delivered') {
    orderDetails['delivary_time'] = formatTime(orderDetails['delivary_time'])
  }
  return orderDetails
}

// helper function
async function findOrderState(orderDetails) {
  const orderState = []
  const orderId = orderDetails.order_id
  const restaurantConfirmed = orderDetails.restaurant_confirmed
  const partnerAssigned = orderDetails.partner_assigned
  const orderPickedup = orderDetails.order_pickedup
  const delivaryStatus = orderDetails.delivary_status

  orderState.push(`order placed with order-id: ${orderId}. order time ${orderDetails.order_time}`)

  if (!restaurantConfirmed) {
    orderState.push(`awaiting restaurant confirmation`)
    return orderState
  }

  orderState.push(`order confirmed by restaurant.`)

  if (!partnerAssigned) {
    orderState.push(`searching for a delivary partner`)
    return orderState
  }

  const partnerId = orderDetails.partner_id
  const response = await getDelivaryPartner(partnerId) // is response.length = 0 possible?
  const delivaryPartnerDetails = response[0]
  const partnerName = delivaryPartnerDetails.partner_name
  const phoneNumber = delivaryPartnerDetails.phone
  orderState.push(`${partnerName} will be carrying your order, phone: ${phoneNumber}`)

  if (!orderPickedup) {
    orderState.push(`awaiting restaurant pickup`)
    return orderState
  }

  if (delivaryStatus !== 'delivered') {
    orderState.push(`order pickedup, awaiting delivary`)
    return orderState
  }

  orderState.push(`order has been delivered, delivary time ${orderDetails.delivary_time}`)
  return orderState
}

export async function getAllOrders(req, res) {
  try {
    const customerId = 1 // get it from auth middleware
    const orders = await getOrders(customerId)

    return res.json({ data: orders, status: 'success' })
  } catch (error) {
    return res.status(500).json({ err: 'internal error', msg: 'unable to process the order' })
  }
}
