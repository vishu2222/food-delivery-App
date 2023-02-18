import React from 'react'
import SavedAddresses from './SavedAddresses'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Addressess() {
  const delivaryAddressId = useSelector((state) => state.delivaryAddressId)
  const navigate = useNavigate()

  return (
    <div>
      <h2>Delivary Address</h2>
      <button onClick={() => navigate('/add-address')}>add new address</button>

      <SavedAddresses />
    </div>
  )
}

export default Addressess
