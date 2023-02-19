const baseUrl = 'http://localhost:3000'

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

  if (res.status !== 200) {
    return [status, null]
  }

  return [res.status, await res.json()]
}
