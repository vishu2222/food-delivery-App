import { placeOrder, getItemPrices, getOrderId } from '../models/queries.js'
import socket from '../sockets/sockets.js'

// validate all items belong to the restaurant or not and return total
async function validateItemsAndGetCartTotal(clientCart, restaurantId) {
  try {
    const itemIds = clientCart.map((item) => item.itemId)
    const dbCart = await getItemPrices(itemIds, restaurantId)
    let totalPrice = 0

    if (dbCart.length !== clientCart.length) {
      return ['invalidItem', totalPrice]
    }

    // use reduce
    clientCart.forEach((clientItem) => {
      const itemPrice = dbCart.find((dbItem) => dbItem.item_id === clientItem.itemId).price
      const itemQuantity = clientItem.quantity
      totalPrice += itemPrice * itemQuantity
    })

    return ['itemsValid', totalPrice]
  } catch (err) {
    throw new Error('internal server error')
  }
}

export async function createOrder(req, res) {
  const cart = req.body
  const orderTime = Date.now()
  const restaurantId = cart.restaurantId
  const orderItems = cart.items
  const addressId = cart.addressId // need to validate addressId
  const customerId = req.params.customer_id
  try {
    console.log(Object.keys(cart))
    if (
      !Object.keys(cart).includes('restaurantId') ||
      !Object.keys(cart).includes('items') ||
      !Object.keys(cart).includes('addressId')
    ) {
      return res.status(400).json({ err: 'bad request', msg: 'insufficient order details' })
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ err: 'bad request', msg: 'cannot place order, cart is empty' })
    }

    if (Object.keys(cart).length > 3) {
      return res.status(400).json({ err: 'bad request', msg: 'order contains prohibited data' })
    }

    for (const item of orderItems) {
      if (Object.keys(item).length > 2) {
        return res.status(400).json({ err: 'bad request', msg: 'order contains prohibited data' })
      }

      if (item.quantity < 1) {
        return res.status(400).json({ err: 'bad request', msg: 'item quantity less than 0' })
      }
    }

    // different items cant have same item_id
    for (let i in orderItems) {
      for (let j in orderItems) {
        if (i !== j && orderItems[i].itemId === orderItems[j].itemId) {
          return res.status(400).json({
            err: 'bad request',
            msg: 'cannot place order, repeated items, increment iteam quantity instead'
          })
        }
      }
    }

    const [itemsValid, total] = await validateItemsAndGetCartTotal(cart.items, restaurantId) // multiple things with one query
    if (itemsValid === 'invalidItem') {
      return res
        .status(404)
        .json({ err: 'bad request', msg: 'cannot place order, some cart items are not found' })
    }

    await placeOrder(
      restaurantId,
      addressId,
      total,
      JSON.stringify(orderItems),
      orderTime,
      customerId
    )

    const orderId = await getOrderId(customerId, restaurantId)
    notifyRestaurant(restaurantId, orderItems, orderId)

    return res.status(201).json({ data: orderId, msg: 'order placed, restaurant notified' })
  } catch (err) {
    return res.status(500).json({ err: 'internal error', msg: 'unable to process the order' })
  }
}

function notifyRestaurant(restaurantId, orderItems, orderId) {
  const io = socket.get()
  const order = { orderId, orderItems }
  //   console.log(order)
  io.emit('new-order', order) // io.to(socketid of restaurant)
}
