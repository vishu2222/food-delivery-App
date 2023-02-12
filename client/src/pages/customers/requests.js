const baseUrl = 'http://localhost:3000'

async function registerCustomer(body) {
  const res = await fetch(`${baseUrl}/users`, {
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify(body)
  })
  return res.status
}

const requests = {
  registerCustomer: registerCustomer
}

export default requests
