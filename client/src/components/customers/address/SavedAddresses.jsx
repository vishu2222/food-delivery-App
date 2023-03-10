import Address from './Address'
import { getCustomerAddress } from '../requests'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setDelivaryAddress } from '../../../store/actions'

function SavedAddresses() {
  const [savedAddressExists, setSavedAddressExists] = useState(false)
  const [addressess, setAddressess] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // get addressess
  useEffect(() => {
    async function getAddress() {
      const [status, response] = await getCustomerAddress()
      if (status === 401) {
        navigate('/login')
        return
      }

      if (status === 404) return

      setSavedAddressExists(true)
      setAddressess(response)
    }
    getAddress()
  }, [navigate])

  useEffect(() => {
    const selectedAddress = addressess.find((address) => address.address_id === selectedAddressId)
    dispatch(setDelivaryAddress(selectedAddress))
  }, [selectedAddressId, dispatch, addressess])

  return (
    <div className=' p-2 mt-2'>
      {savedAddressExists && (
        <div id='saved-addressess'>
          <p className=' font-bold text-2xl'>select from saved addresses</p>
          {addressess.map((address, index) => (
            <div key={index}>
              <Address
                key={index}
                address={address}
                index={index}
                setSelectedAddressId={setSelectedAddressId}
                selectedAddressId={selectedAddressId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedAddresses
