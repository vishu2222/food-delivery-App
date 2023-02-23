import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api'

const containerStyle = { width: '400px', height: '400px' }
const center = { lat: 12.972442, lng: 77.580643 }

export default function Map() {
  const deliveryAddress = useSelector((state) => state.delivaryAddress)

  const customerCenter = { lat: deliveryAddress.lat, lng: deliveryAddress.long }
  const partnerCenter = useSelector((state) => state.partnerLocation)

  return (
    <LoadScript googleMapsApiKey=''>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        <Marker position={center}></Marker>
        <Marker position={customerCenter}></Marker>
        <Marker position={partnerCenter}></Marker>
      </GoogleMap>
    </LoadScript>
  )
}

// process.env.REACT_APP_MAPKEY
