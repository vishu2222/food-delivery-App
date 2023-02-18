import React, { useState } from 'react'
import requests from './customerRequests'
import { useNavigate } from 'react-router-dom'

function AddNewAddress() {
  const [lat, setLat] = useState('')
  const [long, setLong] = useState('')
  const [showCurrentLocation, setShowCurrentLocation] = useState(false)
  const [houseNo, setHouseNo] = useState('')
  const [location, setLocation] = useState('')
  const [city, setCity] = useState('')
  const [displayMsg, setDisplayMsg] = useState('')
  const navigate = useNavigate()

  async function addNewAddress(addressType) {
    let address = { house_no: houseNo, locality: location, city }
    if (addressType === 'current') {
      address = { lat, long }
    }

    const status = await requests.addNewAddress(address)
    if (status !== 201) {
      setDisplayMsg('unable to add address')
    }

    navigate('/check-out')
  }

  function getMyPosition(position) {
    setLat(position.coords.latitude)
    setLong(position.coords.longitude)
    if (lat && long) {
      setShowCurrentLocation(true)
    }
  }

  function positionError(err) {
    // need to retry few times
    setShowCurrentLocation(false)
    if (err.code === 2) {
      setDisplayMsg('cannot get your location please check your internet')
      return
    }
    setDisplayMsg('cannot find your location, please select saved address or add new address')
  }

  navigator.geolocation.getCurrentPosition(getMyPosition, positionError)

  return (
    <div>
      <h2>Add address</h2>
      <h3>{displayMsg}</h3>
      {showCurrentLocation && (
        <div>
          <label>Add your current location</label>
          <p>
            lattitude: {lat} longitude: {long}
          </p>
        </div>
      )}
      <button onClick={() => addNewAddress('current')}>submit</button>

      <h3>Add new Address</h3>

      <label> H.No: </label>
      <input type='text' onChange={(e) => setHouseNo(e.target.value)} />

      <label> location: </label>
      <input type='text' onChange={(e) => setLocation(e.target.value)} />

      <label> city: </label>
      <input type='text' onChange={(e) => setCity(e.target.value)} />

      <button onClick={() => addNewAddress('new')}>submit</button>

      <div></div>
    </div>
  )
}

export default AddNewAddress
