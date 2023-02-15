import React from 'react'
import { Link } from 'react-router-dom'

function Register() {
  return (
    <div>
      <h1>Register</h1>
      <h3>
        <Link to='/register-customer'>register as customer</Link>
      </h3>
      <h3>
        <Link to='/register-restaurant'>register as restaurant</Link>
      </h3>
      <h3>
        <Link to='/register-delivary-partner'>register as delivary-partner</Link>
      </h3>
      <h3>
        Already registered? <Link to='/'>signIn</Link>
      </h3>
    </div>
  )
}

export default Register
