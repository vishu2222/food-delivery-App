import React, { useState, useEffect } from 'react'
import requests from '../requests'
import { useNavigate } from 'react-router-dom'
import Nav from '../Nav'
import { getAddressFromPosition } from '../requests'

function AddNewAddress() {
  const [lat, setLat] = useState('')
  const [long, setLong] = useState('')
  const [showCurrentLocation, setShowCurrentLocation] = useState(false)
  const [houseNo, setHouseNo] = useState('')
  const [location, setLocation] = useState('')
  const [city, setCity] = useState('')
  const [displayMsg, setDisplayMsg] = useState('')
  const [address, setAddress] = useState('')
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

  useEffect(() => {
    ;(async () => {
      const response = await getAddressFromPosition(lat, long)
      setAddress(response.results[0].formatted_address)
    })()
  }, [lat, long])

  return (
    <div>
      <Nav />
      <div className=' bg-gray-200 flex flex-col items-center pb-80 '>
        <h2 className='text-2xl font-extrabold pt-4'>Add address</h2>

        <div className='flex flex-col p-4 w-2/3'>
          <h3>{displayMsg}</h3>
          {showCurrentLocation && (
            <div className=' p-2 text-lg font-serif'>
              <p className=' font-bold'>Add your current location?</p>
              <p>
                lattitude: {lat} longitude: {long}
              </p>
              <p>{address}</p>
            </div>
          )}
          <button className='btn m-2 w-20' onClick={() => addNewAddress('current')}>
            Add
          </button>
        </div>

        <div className='flex flex-col w-2/3'>
          <h3 className=' text-xl font-bold'>Add new Address</h3>

          <p> H.No: </p>
          <input className=' bg-blue-100 border-spacing-2' type='text' onChange={(e) => setHouseNo(e.target.value)} />

          <p> location: </p>
          <input type='text' onChange={(e) => setLocation(e.target.value)} />

          <p> city: </p>
          <input type='text' onChange={(e) => setCity(e.target.value)} />

          <button className='btn w-20' onClick={() => addNewAddress('new')}>
            submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddNewAddress
