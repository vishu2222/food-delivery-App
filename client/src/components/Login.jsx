import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import requests from '../requests'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [userName, setuserName] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('customer')
  const [displayErr, setDisplayErr] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  async function signIn() {
    const status = await requests.login(userName, password, userType)
    if (status !== 201) {
      setDisplayErr(true)
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
        navigate('/delivery_partner')
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
        <label>userType</label>
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option>customer</option>
          <option>restaurant</option>
          <option>delivery_partner</option>
        </select>
        <button onClick={signIn}> Sign In </button>
        <h3>
          New User? <Link to='/register'>signup</Link>
        </h3>
      </form>
      <p>{displayErr && errMsg}</p>
    </div>
  )
}

export default Login
