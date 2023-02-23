import React from 'react'
import { useEffect, useState } from 'react'
import { getAllOrders } from './partnerRequests'
import { formatTime } from '../utlities/formateTime'
import { useNavigate } from 'react-router-dom'
import Order from './Order'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', { autoConnect: false, transports: ['websocket'] })

function DelivaryPartnerHome() {
  const [orders, setOrders] = useState([])
  const [lat, setLat] = useState(0)
  const [long, setLong] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      let [status, ordersList] = await getAllOrders()

      if (status === 401) {
        navigate('/login')
        return
      }

      ordersList = ordersList.map((order) => {
        order.order_time = formatTime(order.order_time)
        return order
      })

      setOrders(ordersList)
    })()
  }, [navigate])

  useEffect(() => {
    socket.connect()

    socket.on('connect', () => {
      console.log('socket connected')
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected')
    })

    socket.on('partner-update', (newOrder) => {
      console.log('newOrder:', newOrder)
      setOrders((current) => [newOrder, ...current])
    })

    // socket.emit('partnerLiveLocation', { lat, long }) // will emit only when partner moves

    function getMyPosition(position) {
      setLat(position.coords.latitude)
      setLong(position.coords.longitude)
      console.log(position.coords.latitude)
    }

    function error(err) {
      // need to handle error
      // err can occur due to internet disconnectivity
      console.log('err:', err.message)
    }

    const emitInterval = 1000 * 60

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(getMyPosition, error)
      socket.emit('partnerLiveLocation', { lat, long }) // will emit every specifed number of seconds
    }, emitInterval)

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('partner-update')
      socket.off('partnerLiveLocation')
      clearInterval(interval)
    }
  }, [lat, long])

  return (
    <div>
      <h1>Delivary Partner Home</h1>
      <p>
        My position: lattitude: {lat}, longitude: {long}
      </p>
      <h2>Orders</h2>
      {orders.map((order, index) => {
        return (
          <div key={index}>
            <Order order={order} index={index} />
          </div>
        )
      })}
    </div>
  )
}

export default DelivaryPartnerHome

// useEffect(() => {
//   const watcherId = navigator.geolocation.watchPosition(watchMyposition, err, { maximumAge: 0, timeout: 5000 })

//   function watchMyposition(position) {
//     setLat(position.coords.latitude)
//     setLong(position.coords.longitude)
//     console.log('position:', position)
//   }

//   function err() {
//     console.log('unable to obtain location please reload page and try')
//   }

//   return () => {
//     navigator.geolocation.clearWatch(watcherId)
//   }
// }, [])
