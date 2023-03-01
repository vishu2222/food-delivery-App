import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import requests from './requests'
import { useNavigate } from 'react-router-dom'
import { isUserSignedIn, addUserName } from '../../store/actions'
import { useDispatch } from 'react-redux'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [userName, setuserName] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')

  async function signIn() {
    const [status, userType] = await requests.login(userName, password)

    if (status !== 201) {
      setErrMsg('invalid login')
      return
    }

    dispatch(isUserSignedIn(true))
    dispatch(addUserName(userName))

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
    <div className=' flex justify-center items-center  bg-orange-50 pt-72 pb-96 '>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className='mb-4' id='userName'>
          <label className='labels'> User Name </label>
          <input className='bg-slate-100 border-4 w-60' type='text' onChange={(e) => setuserName(e.target.value)} />
        </div>

        <div className='mb-4'>
          <label className='labels mr-3'> Password </label>
          <input
            className='bg-slate-100 border-4 w-60 ml-1'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className='btn w-60 ml-28' onClick={signIn}>
          Sign In
        </button>
        <p className=' text-red-800 ml-28'>{errMsg}</p>
        <h3 className='mt-10'>
          New User?
          <Link className='btn ml-2 ' to='/register'>
            sign up
          </Link>
        </h3>
      </form>
    </div>
  )
}

export default Login
