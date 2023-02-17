import React from 'react'

function Address({ address, index }) {
  const city = address.city
  const hno = address.hno
  const locality = address.locality

  return (
    <div>
      <p>
        {index + 1}. city: {city}. H.No: {hno}. Locality: {locality}
      </p>
    </div>
  )
}

export default Address
