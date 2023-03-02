import React, { useEffect, useState } from 'react'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { useSelector } from 'react-redux'
import restaurantIcon from '../../icons/restaurant.png'
import bikeIcon from '../../icons/bike.png'

const containerStyle = {
  width: '700px',
  height: '500px'
}

const center = {
  lat: 12.97,
  lng: 77.5806
}

function MyComponent() {
  const [partnerAssigned, setPartnerAssigned] = useState(false)

  const deliveryAddress = useSelector((state) => state.delivaryAddress)
  const customerCenter = { lat: deliveryAddress.lat, lng: deliveryAddress.long }

  const restaurant = useSelector((state) => state.restaurant)

  const restaurantCenter = { lat: restaurant.lat, lng: restaurant.long }

  const partnerCenter = useSelector((state) => state.partnerLocation)
  console.log('partnerLocation:', partnerCenter)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: ''
    // process.env.REACT_APP_MAPKEY
  })

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
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
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
    </GoogleMap>
  )
}

export default React.memo(MyComponent)

// https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png

// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api'
// import restaurantIcon from '../../icons/restaurant.png'
// import delivaryBike from '../../icons/delivaryBike.jpg'

// export default function Map() {
//   const containerStyle = { width: '700px', height: '500px' }
//   const icon = {
//     url: restaurantIcon,
//     scaledSize: new window.google.maps.Size(40, 40)
//   }

//   const deliveryAddress = useSelector((state) => state.delivaryAddress)
//   const restaurant = useSelector((state) => state.restaurant)
//   const [showPartnerMarker, setShowParnerMarker] = useState(false)

//   const customerCenter = { lat: deliveryAddress.lat, lng: deliveryAddress.long }
//   const restaurantCenter = { lat: restaurant.lat, lng: restaurant.long }
//   const partnerCenter = useSelector((state) => state.partnerLocation)

//   useEffect(() => {
//     if (partnerCenter.lat && partnerCenter.lng) {
//       setShowParnerMarker(true)
//     }
//   }, [partnerCenter.lat, partnerCenter.lng])

//   console.log('restaurantCenter', restaurantCenter)
//   console.log('customerCenter', customerCenter)
//   console.log('partnerCenter', partnerCenter)

//   return (
//     <LoadScript googleMapsApiKey=''>
//       <GoogleMap mapContainerStyle={containerStyle} center={customerCenter} zoom={13}>
//         <Marker position={restaurantCenter} icon={icon}></Marker>
//         <Marker position={customerCenter}></Marker>
//         {showPartnerMarker && <Marker position={partnerCenter}></Marker>}
//       </GoogleMap>
//     </LoadScript>
//   )
// }

// // process.env.REACT_APP_MAPKEY
