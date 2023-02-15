const baseUrl = 'http://localhost:3000'

async function login(userName, password, userType) {
  const res = await fetch(`${baseUrl}/sessions`, {
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userName, password, userType })
  })
  return res.status
}

async function authorizeMe() {
  const res = await fetch(`${baseUrl}/sessions`, {
    credentials: 'include'
  })
  if (res.status !== 200) {
    return [res.status, '']
  }
  const response = await res.json()
  return [res.status, response.userRole]
}

const requests = {
  login: login,
  authorizeMe: authorizeMe
}

export default requests
