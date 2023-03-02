import React from 'react'
import SavedAddresses from './SavedAddresses'
import { useNavigate } from 'react-router-dom'

function Addressess() {
  const navigate = useNavigate()

  return (
    <div className=' p-4'>
      <h2 className='font-extrabold text-2xl p-2'>Delivary Address</h2>
      <button
        className=' text-white font-serif bg-gray-600 rounded-full cursor-pointer p-2'
        onClick={() => navigate('/add-address')}>
        Add New
      </button>

      <SavedAddresses />
    </div>
  )
}

export default Addressess
