import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function RestaurantRegistration() {
  const [userName, setUsername] = useState('')
  const [restaurantName, setrestaurantName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [lat, setLat] = useState('')
  const [long, setLong] = useState('')
  const [address, setAddress] = useState('')
  const [startTime, setStartTime] = useState('')
  const [closeTime, setCloseTime] = useState('')
  const [displayErr, setDisplayErr] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [img, setImg] = useState('')

  const navigate = useNavigate()

  function validateCredentials() {
    if (userName.trim().length === 0 || restaurantName.trim().length === 0) return

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

  let temp = [
    img,
    setConfirmPwd,
    setPassword,
    navigate,
    setImg,
    errMsg,
    setErrMsg,
    setUsername,
    setrestaurantName,
    displayErr,
    setDisplayErr,
    closeTime,
    setCloseTime,
    phone,
    setPhone,
    lat,
    setLat,
    long,
    setLong,
    address,
    validateCredentials,
    setAddress,
    startTime,
    setStartTime
  ]
  temp = ''
  console.log(temp)
  //   async function registerCustomer() {
  //     if (!validateCredentials()) return
  //     const credentials = { userName, userType: 'customer', password, customerName, phone, email }
  //     const status = await requests.registerCustomer(credentials)
  //     console.log(typeof status, 'status', status)
  //     if (status !== 201) {
  //       setDisplayErr(true)
  //       setErrMsg('unable to register')
  //       return
  //     }
  //     navigate('/login')
  //   }

  return (
    <div>
      <p>RestaurantRegistration</p>
    </div>
  )
}

export default RestaurantRegistration

//

// function CustomerRegistration() {

//   return (
//     <div>
//       <p>CustomerRegistration</p>
//       <form onSubmit={(e) => e.preventDefault()}>
//         <label> User Name* </label>
//         <input
//           type='text'
//           onChange={(e) => {
//             setUsername(e.target.value)
//             setDisplayErr(false)
//           }}
//         />
//         <label> Password* </label>
//         <input
//           type='password'
//           onChange={(e) => {
//             setPassword(e.target.value)
//             setDisplayErr(false)
//           }}
//         />
//         <label> Re-type Password* </label>
//         <input
//           type='password'
//           onChange={(e) => {
//             setConfirmPwd(e.target.value)
//             setDisplayErr(false)
//           }}
//         />
//         <br />
//         <label> Your Name* </label>
//         <input
//           type='text'
//           onChange={(e) => {
//             setCustomerName(e.target.value)
//             setDisplayErr(false)
//           }}
//         />
//         <label> Phone* </label>
//         <input
//           type='tel'
//           onChange={(e) => {
//             setPhone(e.target.value)
//             setDisplayErr(false)
//           }}
//         />
//         <label> email</label>
//         <input
//           type='email'
//           onChange={(e) => {
//             setEmail(e.target.value)
//             setDisplayErr(false)
//           }}
//         />

//         <button onClick={registerCustomer}>Register</button>
//       </form>
//       {displayErr && errMsg}
//     </div>
//   )
// }

// export default CustomerRegistration
