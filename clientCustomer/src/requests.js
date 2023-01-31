const baseUrl = 'http://localhost:3000'

export async function getRestaurants() {
  const res = await fetch(`${baseUrl}/restaurants`)
  const response = await res.json()
  return response.data
}

export async function getMenu(id) {
  const res = await fetch(`${baseUrl}/restaurants/${id}`)
  const response = await res.json()
  return response.data
}

export async function placeOrder(cart) {
  console.log('cartItemsInplaceOrder', cart)
  const res = await fetch(`${baseUrl}/orders`, {
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(cart)
  })
  return res.status
}
