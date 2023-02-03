import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', {
  autoConnect: false,
  transports: ['websocket']
})

function Delivary() {
  const [latitude, setLat] = useState(0)
  const [longitude, setLong] = useState(0)
  // const [liveLatitude, setLiveLat] = useState(0)
  // const [liveLongitude, setLiveLong] = useState(0)

  const partnerId = 1 // need to getit from login and authenticatoin

  function success(position) {
    setLat(position.coords.latitude)
    setLong(position.coords.longitude)
  }

  function error(err) {
    console.log(err) // need to handle error
  }

  navigator.geolocation.getCurrentPosition(success, error, { timeout: 5000 })

  // function livePosition(livePosition) {
  // const liveLat = livePosition.coords.latitude
  // const liveLong = livePosition.coords.longitude
  // setLiveLat(liveLat)
  // setLiveLong(liveLong)
  // console.log('current position:', lat, long)
  // }

  // function err() {}

  // const watcherId = navigator.geolocation.watchPosition(livePosition, err, { maximumAge: 0, timeout: 5000 })
  // console.log('watcherId', watcherId)

  // useEffect(() => {
  //   socket.connect()

  //   socket.on('connect', () => {
  //     console.log('socket connected')
  //   })

  //   socket.on('partner-live-location', () => {
  //     socket.emit('my-live-location', { partnerId, loc: { liveLatitude, liveLongitude } })
  //   })

  //   return () => {
  //     socket.off('connect')
  //   }
  // }, [liveLatitude, liveLongitude])

  useEffect(() => {
    socket.connect()

    socket.on('connect', () => {
      console.log('socket connected')
    })

    console.log(latitude, longitude)
    socket.on('partner-location', () => {
      socket.emit('my-location', { partnerId, loc: { latitude, longitude } })
    })

    return () => {
      socket.off('connect')
      socket.off('my-location')
      socket.off('partner-location')
    }
  }, [latitude, longitude])
  return <div>interface for delivary partner</div>
}

export default Delivary
