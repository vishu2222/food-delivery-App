const baseUrl = 'http://localhost:3000'

async function login(userName, password) {
  const res = await fetch(`${baseUrl}/sessions/new`, {
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userName, password })
  })
  console.log('requests:', res)
}

const requests = {
  login: login
}

export default requests
