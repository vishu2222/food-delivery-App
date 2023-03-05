// const baseUrl = 'http://localhost:8080/api'

const baseUrl = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8080/api'

async function login(userName, password) {
  const res = await fetch(`${baseUrl}/sessions`, {
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userName, password })
  })
  if (res.status !== 201) {
    return [res.status, null]
  }
  const data = await res.json()
  return [res.status, data.user_type]
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
