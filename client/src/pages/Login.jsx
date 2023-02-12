import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import requests from '../requests'

function Login() {
  const [userName, setuserName] = useState('')
  const [password, setPassword] = useState('')

  async function signIn() {
    const res = await requests.login(userName, password)
    console.log(res)
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
    </div>
  )
}

export default Login
