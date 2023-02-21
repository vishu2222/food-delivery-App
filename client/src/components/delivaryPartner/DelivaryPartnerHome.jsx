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

      console.log('ordersList:', ordersList)
      setOrders(ordersList)
    })()
  }, [navigate])

  useEffect(() => {
    socket.connect()

    socket.on('connect', () => {
      // console.log('socket id:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('disconnected')
    })

    socket.on('partner-update', (newOrder) => {
      console.log('newOrder:', newOrder)
      setOrders((current) => [newOrder, ...current])
    })

    return () => {
      socket.off('connect')
      socket.off('disconnected')
      socket.off('partner-update')
    }
  }, [])

  function getMyPosition(position) {
    setLat(position.coords.latitude)
    setLong(position.coords.longitude)
  }

  function error(err) {
    // err can occur due to internet disconnectivity
    console.log('err:', err.message)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(getMyPosition, error)
    }, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [])

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
