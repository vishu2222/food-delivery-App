import React from 'react'
import { useState } from 'react'
import requests from './customerRequests'
import { useNavigate } from 'react-router-dom'

function CustomerRegistration() {
  const [userName, setUsername] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [displayErr, setDisplayErr] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  const navigate = useNavigate()

  function validateCredentials() {
    if (userName.trim().length === 0 || customerName.trim().length === 0) return

    if (password.length < 4) {
      setDisplayErr(true)
      setErrMsg('password length should be 4 or above ')
      return
    }

    if (password.match(/[\w]*[\d][\w]*/) === null) {
      setDisplayErr(true)
      setErrMsg('password should contain atleast 1 digit')
      return
    }

    if (password.match(/[\w]*[a-zA-Z][\w]*/) === null) {
      setDisplayErr(true)
      setErrMsg('password should contain atleast 1 letter')
      return
    }

    if (password !== confirmPwd) {
      setDisplayErr(true)
      setErrMsg('passwords didnt match')
      return
    }

    return true
  }

  async function registerCustomer() {
    if (!validateCredentials()) return
    const credentials = { userName, userType: 'customer', password, customerName, phone, email }
    const status = await requests.registerCustomer(credentials)
    // console.log(typeof status, 'status', status)
    if (status !== 201) {
      setDisplayErr(true)
      setErrMsg('unable to register')
      return
    }
    navigate('/login')
  }

  return (
    <div>
      <p>CustomerRegistration</p>
      <form onSubmit={(e) => e.preventDefault()}>
        <label> User Name* </label>
        <input
          type='text'
          onChange={(e) => {
            setUsername(e.target.value)
            setDisplayErr(false)
          }}
        />
        <label> Password* </label>
        <input
          type='password'
          onChange={(e) => {
            setPassword(e.target.value)
            setDisplayErr(false)
          }}
        />
        <label> Re-type Password* </label>
        <input
          type='password'
          onChange={(e) => {
            setConfirmPwd(e.target.value)
            setDisplayErr(false)
          }}
        />
        <br />
        <label> Your Name* </label>
        <input
          type='text'
          onChange={(e) => {
            setCustomerName(e.target.value)
            setDisplayErr(false)
          }}
        />
        <label> Phone* </label>
        <input
          type='tel'
          onChange={(e) => {
            setPhone(e.target.value)
            setDisplayErr(false)
          }}
        />
        <label> email</label>
        <input
          type='email'
          onChange={(e) => {
            setEmail(e.target.value)
            setDisplayErr(false)
          }}
        />

        <button onClick={registerCustomer}>Register</button>
      </form>
      {displayErr && errMsg}
    </div>
  )
}

export default CustomerRegistration
