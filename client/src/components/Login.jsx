import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import requests from './Common/requests'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [userName, setuserName] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')

  async function signIn() {
    const [status, userType] = await requests.login(userName, password)

    if (status !== 201) {
      setErrMsg('invalid login')
      return
    }

    switch (userType) {
      case 'customer':
        navigate('/customer-Home')
        break
      case 'restaurant':
        navigate('/restaurant-Home')
        break
      case 'delivery_partner':
        navigate('/delivery_partner-Home')
        break

      default:
        navigate('/login')
    }
  }

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <h2>Login</h2>
        <label> User Name </label>
        <input type='text' onChange={(e) => setuserName(e.target.value)} />
        <label> Password </label>
        <input type='password' onChange={(e) => setPassword(e.target.value)} />
        <button onClick={signIn}> Sign In </button>
        <h3>
          New User? <Link to='/register'>signup</Link>
        </h3>
      </form>
      <p>{errMsg}</p>
    </div>
  )
}

export default Login
