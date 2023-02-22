import React from 'react'
import SavedAddresses from './SavedAddresses'
import { useNavigate } from 'react-router-dom'

function Addressess() {
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
