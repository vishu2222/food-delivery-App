import React, { useState } from 'react'

function Address({ address, index, setSelectedAddressId, selectedAddressId }) {
  const [displayMsg, setDisplayMsg] = useState('')
  const city = address.city
  const hno = address.hno
  const locality = address.locality

  function setAddress(address, checked) {
    if (checked) {
      setSelectedAddressId(address.address_id)
      return
    }
    setSelectedAddressId(null)
  }

  return (
    <div>
      <p>
        <input
          type='checkbox'
          checked={selectedAddressId === address.address_id}
          onChange={(e) => {
            setAddress(address, e.target.checked)
          }}
        />
        {index + 1}. city: {city}. H.No: {hno}. Locality: {locality}
      </p>
      <p>{displayMsg}</p>
    </div>
  )
}

export default Address
