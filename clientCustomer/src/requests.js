const baseUrl = 'http://localhost:3000'

export async function getRestaurants() {
  const res = await fetch(`${baseUrl}/restaurants`)
  const response = await res.json()
  return response.data
}

export async function getMenu(restaurantId) {
  const res = await fetch(`${baseUrl}/restaurants/${restaurantId}/menu`)
  const response = await res.json()
  return response.data
}

export async function placeOrder(cart, customerId) {
  console.log('cartItemsInplaceOrder', cart)
  const res = await fetch(`${baseUrl}/customers/${customerId}`, {
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(cart)
  })

  const status = res.status
  if (status !== 201) return [status, null]
  const result = await res.json()
  const orderId = result.data
  return [status, orderId]
}
