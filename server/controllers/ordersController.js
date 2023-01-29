import { placeOrder, getItemPrices } from '../models/queries.js'

async function validateItemsAndGetCartTotal(clientCart, restaurantId) {
  // validate all items belong to the restaurant and return total
  let totalPrice = 0
  try {
    const itemIds = clientCart.map((item) => item.itemId)
    const dbCart = await getItemPrices(itemIds, restaurantId)

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
  try {
    const cart = req.body
    const orderTime = Date.now()
    const restaurantId = cart.restaurantId
    const orderItems = cart.items
    const customerId = cart.customerId

    if (
      !Object.keys(cart).includes('restaurantId') ||
      !Object.keys(cart).includes('items') ||
      !Object.keys(cart).includes('customerId')
    ) {
      return res.status(400).json({ err: 'bad request', msg: 'insufficient order details' })
    }

    if (Object.keys(cart).length > 3) {
      return res.status(400).json({ err: 'bad request', msg: 'order contains prohibited data' })
    }

    for (const item of orderItems) {
      if (Object.keys(item).length > 2) {
        return res.status(400).json({ err: 'bad request', msg: 'order contains prohibited data' })
      }
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ err: 'bad request', msg: 'cannot place order, cart is empty' })
    }

    for (let i in orderItems) {
      for (let j in orderItems) {
        if (i !== j) {
          if (orderItems[i].itemId === orderItems[j].itemId) {
            return res.status(400).json({
              err: 'bad request',
              msg: 'cannot place order, repeated items, increment iteam quantity instead'
            })
          }
        }
      }
    }

    const [validation, total] = await validateItemsAndGetCartTotal(cart.items, restaurantId)
    if (validation === 'invalidItem') {
      return res
        .status(404)
        .json({ err: 'bad request', msg: 'cannot place order, some cart items are not found' })
    }

    await placeOrder(restaurantId, total, JSON.stringify(orderItems), orderTime, customerId)
    return res.status(201).json({ status: 'success', msg: 'order placed' })
  } catch (err) {
    return res.status(500).json({ err: 'internal error', msg: 'unable to process the order' })
  }
}
