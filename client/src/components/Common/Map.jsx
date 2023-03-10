import React, { useEffect, useState } from 'react'
import { GoogleMap, Marker, useLoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api'
import { useSelector } from 'react-redux'
import restaurantIcon from '../../icons/restaurant.png'
import bikeIcon from '../../icons/bike.png'

const containerStyle = {
  width: '100%',
  height: '100%'
}

function Map() {
  const [partnerAssigned, setPartnerAssigned] = useState(false)
  const [directions, setDirections] = useState(null)

  const restaurant = useSelector((state) => state.restaurant)
  const restaurantCenter = { lat: restaurant.lat, lng: restaurant.long }

  const [mapCenter, setMapCenter] = useState({ lat: restaurant.lat, lng: restaurant.long })

  const deliveryAddress = useSelector((state) => state.delivaryAddress)
  const customerCenter = { lat: deliveryAddress.lat, lng: deliveryAddress.long }

  const partnerCenter = useSelector((state) => state.partnerLocation)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_KEY
  })

  function directionsCallback(direction) {
    if (direction !== null) {
      setDirections(direction)
    }
  }

  useEffect(() => {
    if (partnerCenter.lat && partnerCenter.lng) {
      setPartnerAssigned(true)
    } else {
      setPartnerAssigned(false)
    }
  }, [partnerCenter.lat, partnerCenter.lng])

  if (loadError) {
    return <div>Error loading maps</div>
  }

  if (!isLoaded) {
    return <div>Loading maps</div>
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} zoom={16} center={mapCenter}>
      <Marker id='customer' position={customerCenter}></Marker>
      <Marker
        id='restaurant'
        position={restaurantCenter}
        icon={{ url: restaurantIcon, scaledSize: new window.google.maps.Size(40, 40) }}></Marker>

      {partnerAssigned && (
        <Marker
          id='partner'
          position={partnerCenter}
          icon={{ url: bikeIcon, scaledSize: new window.google.maps.Size(40, 40) }}></Marker>
      )}

      {partnerAssigned && (
        <DirectionsService
          options={{
            destination: new window.google.maps.LatLng(customerCenter.lat, customerCenter.lng),
            origin: new window.google.maps.LatLng(partnerCenter.lat, partnerCenter.lng),
            waypoints: [{ location: { lat: restaurantCenter.lat, lng: restaurantCenter.lng } }],
            travelMode: 'DRIVING'
          }}
          callback={directionsCallback}></DirectionsService>
      )}

      {partnerAssigned && directions && (
        <DirectionsRenderer
          directions={directions}
          options={{ polylineOptions: { strokeColor: 'green' }, suppressMarkers: true }}
        />
      )}
    </GoogleMap>
  )
}

export default React.memo(Map)
