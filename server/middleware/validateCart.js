// cart validations
export function validateCart(req, res, next) {
  const cart = req.body

  const [err, msg] = validateOrder(cart)
  if (err) {
    return res.status(400).json({ err, msg })
  }
  next()
}

export function validateOrder(cart) {
  let err = null
  let msg
  ;[err, msg] = validateCartContent(cart)
  if (err) {
    return [err, msg]
  }

  ;[err, msg] = isCartEmpty(cart.items)
  if (err) {
    return [err, msg]
  }

  ;[err, msg] = validateCartItems(cart.items)
  if (err) {
    return [err, msg]
  }

  ;[err, msg] = validateCartItemQuantities(cart.items)
  if (err) {
    return [err, msg]
  }
  return [err, msg]
}

function validateCartItemQuantities(cartItems) {
  for (const quantity of Object.values(cartItems)) {
    if (quantity < 1) {
      const err = 'bad request'
      return [err, 'min item quantity is 1']
    }
  }
  return [null, null]
}

export async function validateRestaurantId(restaurantId) {
  if (!Number.isInteger(Number(restaurantId))) {
    const err = 'bad request'
    return [err, 'invalid restaurant ID']
  }
  return [null, null]
}

function validateCartContent(cart) {
  if (JSON.stringify(Object.keys(cart)) !== '["restaurantId","addressId","items"]') {
    const err = 'bad request'
    const msg = `order details inadequate
                 or order details not in expected order 
                 or spelling mistakes in cart fields
                 or unwanted data included in cart`
    return [err, msg]
  }
  return [null, null]
}

function isCartEmpty(clientCartItems) {
  if (Object.keys(clientCartItems).length === 0) {
    const err = 'bad request'
    const msg = 'cart is empty'
    return [err, msg]
  }
  return [null, null]
}

function validateCartItems(clientCartItems) {
  const clientCartItemIds = Object.keys(clientCartItems)
  for (const itemId of clientCartItemIds) {
    if (!Number.isInteger(Number(itemId))) {
      const err = 'bad request'
      const msg = 'invalid items, item Ids should be integers'
      return [err, msg]
    }
  }
  return [null, null]
}

// need to validate  restaurantId

// different items cant have same item_id
// for (let i in orderItems) {
//   for (let j in orderItems) {
//     if (i !== j && orderItems[i].itemId === orderItems[j].itemId) {
//       return res.status(400).json({
//         err: 'bad request',
//         msg: 'cannot place order, repeated items, increment iteam quantity instead'
//       })
//     }
//   }
// }
