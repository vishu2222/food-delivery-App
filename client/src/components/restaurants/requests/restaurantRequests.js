// const baseUrl = 'http://localhost:8080/api'

const baseUrl = process.env.NODE_ENV === 'production' ? '/api' : 'https://localhost:8080/api'

export async function getAllOrders() {
  const res = await fetch(`${baseUrl}/orders`, {
    credentials: 'include'
  })

  if (res.status === 401) {
    return [res.status, null]
  }
  return [res.status, await res.json()]
}

export async function updateOrder(orderId, status) {
  const res = await fetch(`${baseUrl}/orders/${orderId}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
  //   if (res.status !== 200) {
  //     return [status.null]
  //   }
  return [res.status, await res.json()]
}

// export async function placeOrder(cart, customerId) {
//   console.log('cartItemsInplaceOrder', cart)
//   const res = await fetch(`${baseUrl}/orders`, {
//     credentials: 'include',
//     headers: { 'content-type': 'application/json' },
//     method: 'POST',
//     body: JSON.stringify(cart)
//   })

//   const status = res.status
//   if (status !== 201) return [status, null]
//   const result = await res.json()
//   const orderId = result.orderId
//   return [status, orderId]
// }
