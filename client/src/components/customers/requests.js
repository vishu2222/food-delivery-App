const baseUrl = process.env.NODE_ENV === 'production' ? '/api' : 'https://localhost:8080/api'

async function registerCustomer(body) {
  const res = await fetch(`${baseUrl}/users`, {
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(body)
  })
  return res.status
}

async function getOrderDetails(orderId) {
  const res = await fetch(`${baseUrl}/orders/${orderId}`, {
    credentials: 'include'
  })
  if (res.status !== 200) {
    return [res.status, null]
  }
  return [res.status, await res.json()]
}

export async function getAllOrders() {
  const res = await fetch(`${baseUrl}/orders`, {
    credentials: 'include'
  })

  return await res.json()
  // if (res.status !== 200) {
  //   return [res.status, null]
  // }
  // return [res.status, await res.json()]
}

export async function getRestaurants() {
  const res = await fetch(`${baseUrl}/restaurants`)
  const response = await res.json()

  return response
}

export async function getRestaurant(restaurantId) {
  const res = await fetch(`${baseUrl}/restaurants/${restaurantId}`)
  return await res.json()
}

export async function placeOrder(cart, customerId) {
  console.log('cartItemsInplaceOrder', cart)
  const res = await fetch(`${baseUrl}/orders`, {
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(cart)
  })

  const status = res.status
  if (status !== 201) return [status, null]
  const result = await res.json()
  const orderId = result.orderId
  return [status, orderId]
}

export async function getCustomerAddress() {
  const res = await fetch(`${baseUrl}/customers/address`, {
    credentials: 'include'
  })
  if (res.status !== 200) return [res.status, null]
  return [res.status, await res.json()]
}

async function addNewAddress(address) {
  const res = await fetch(`${baseUrl}/customers/address`, {
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(address)
  })

  return res.status
}

export async function getAddressFromPosition(lat, long) {
  const res = await fetch(`${baseUrl}/customers/location`, {
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ lat, long })
  })

  if (res.ok) {
    return res.json()
  }
}

async function logout() {
  const res = await fetch(`${baseUrl}/sessions`, { credentials: 'include', method: 'DELETE' })
  console.log('res', res.ok)
  if (res.ok) {
    return res.status
  }
}

const requests = {
  registerCustomer: registerCustomer,
  getRestaurants: getRestaurants,
  addNewAddress: addNewAddress,
  getOrderDetails: getOrderDetails,
  logout: logout
}

export default requests
