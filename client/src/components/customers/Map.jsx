import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api'
// import { useLocation } from 'react-router-dom'

const containerStyle = { width: '400px', height: '400px' }
const center = { lat: 12.972442, lng: 77.580643 }

export default function Map() {
  //   const location = useLocation()
  //   const orderId = Number(location.pathname.split('order-details/')[1])
  const deliveryAddress = useSelector((state) => state.delivaryAddress)
  const customerCenter = { lat: deliveryAddress.lat, lng: deliveryAddress.long }

  return (
    <LoadScript googleMapsApiKey=''>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        <Marker position={center}></Marker>
        <Marker position={customerCenter}></Marker>
      </GoogleMap>
    </LoadScript>
  )
}

// process.env.REACT_APP_MAPKEY
