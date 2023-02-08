import { getRestaruant, getAddress } from '../models/customerModel.js'

// cart validations
//
export async function validateCart(cart, customerId) {
  // use obj
  let [status, err, msg] = [null, null, null]

  ;[status, err, msg] = validateCartContent(cart)
  if (err) {
    return [status, err, msg]
  }

  ;[status, err, msg] = isCartEmpty(cart.items)
  if (err) {
    return [status, err, msg]
  }

  ;[status, err, msg] = validateCartItems(cart.items)
  if (err) {
    return [status, err, msg]
  }

  ;[status, err, msg] = validateCartItemQuantities(cart.items)
  if (err) {
    return [status, err, msg]
  }

  ;[status, err, msg] = await validateRestaurantId(cart.restaurantId)
  if (err) {
    return [status, err, msg]
  }

  ;[status, err, msg] = await validateAddress(customerId, cart.addressId)
  if (err) {
    return [status, err, msg]
  }

  return [status, err, msg]
}

//
function validateCartItemQuantities(cartItems) {
  let [status, err, msg] = [null, null, null]
  for (const quantity of Object.values(cartItems)) {
    if (quantity < 1) {
      status = 400
      err = 'bad request'
      msg = 'min item quantity is 1'
      return [status, err, msg]
    }
  }
  return [status, err, msg]
}

export async function validateRestaurantId(restaurantId) {
  let status = null
  let msg = null
  let err = null

  if (!Number.isInteger(Number(restaurantId))) {
    err = 'bad request'
    msg = 'invalid restaurant ID'
    status = 400
    return [status, err, msg]
  }

  const restaturant = await getRestaruant(restaurantId)
  if (restaturant.length === 0) {
    err = 'bad request'
    msg = 'restaurant not found'
    status = 404
    return [status, err, msg]
  }

  return [status, err, msg]
}

async function validateAddress(customerId, addressId) {
  let status = null
  let msg = null
  let err = null
  const address = await getAddress(addressId)

  if (address.length === 0) {
    status = 404
    err = 'address not found'
    msg = 'customer address doesnot exist'
    return [status, err, msg]
  }

  const addressFound = address[0]
  if (addressFound.customer_id !== customerId) {
    status = 400
    err = 'address doesnt match'
    msg = 'given address doesnot match with saved addressess'
    return [status, err, msg]
  }

  return [status, err, msg]
}

function validateCartContent(cart) {
  let err = null
  let msg = null
  let status = null
  if (JSON.stringify(Object.keys(cart)) !== '["restaurantId","addressId","items"]') {
    err = 'bad request'
    msg = `order details inadequate
           or order details not in expected order 
           or spelling mistakes in cart fields
           or unwanted data included in cart`
    status = 400
    return [status, err, msg]
  }
  return [status, err, msg]
}

function isCartEmpty(clientCartItems) {
  let err = null
  let status = null
  let msg = null
  if (clientCartItems.length === 0) {
    err = 'bad request'
    msg = 'cart is empty'
    status = 400
    return [status, err, msg]
  }
  return [status, err, msg]
}

function validateCartItems(clientCartItems) {
  const clientCartItemIds = Object.keys(clientCartItems)
  let err = null
  let status = null
  let msg = null
  for (const itemId of clientCartItemIds) {
    if (!Number.isInteger(Number(itemId))) {
      err = 'bad request'
      msg = 'invalid items, item Ids should be integers'
      status = 400
      return [status, err, msg]
    }
  }
  return [status, err, msg]
}

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
