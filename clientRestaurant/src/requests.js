const baseUrl = 'http://localhost:3000'

export async function confirmOrder(orderId, confirmation) {
  const res = await fetch(`${baseUrl}/orders/${orderId}`, {
    headers: { 'content-type': 'application/json' },
    method: 'PUT',
    body: JSON.stringify({ confirmation })
  })
  console.log('res', res.status)
  // case res.status !=== 200
}
