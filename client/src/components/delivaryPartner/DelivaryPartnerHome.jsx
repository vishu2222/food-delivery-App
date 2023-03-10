import React from 'react'
import { useEffect, useState } from 'react'
import { getAllOrders } from './partnerRequests'
import { formatTime } from '../utlities/formateTime'
import { useNavigate } from 'react-router-dom'
import Order from './Order'
import { io } from 'socket.io-client'

// console.log('process.env.NODE_ENV === production', process.env.NODE_ENV === 'production', process.env.NODE_ENV)

const serverUrl = process.env.REACT_APP_ServerUrl

const socket = io(serverUrl, { autoConnect: false, transports: ['websocket'] })

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

    socket.on('partner-update', (order) => {
      console.log('order and status:', order, order.status)
      if (order.status === 'awaiting pickup') {
        setOrders((current) => [order, ...current])
        return
      }
    })

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

    // socket.emit('partnerLiveLocation', { lat, long }) // will emit only when partner moves

    const emitInterval = 1000 * 4
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
    <div className=' flex flex-col items-center bg-black h-screen'>
      <h2 className='flex justify-center p-2 text-3xl font-extrabold text-white'>ORDERS</h2>
      <div className=' w-1/2 p-2'>
        {orders.map((order, index) => {
          return (
            <div key={order.order_id} className=' bg-slate-100 mb-2'>
              <Order order={order} />
            </div>
          )
        })}
      </div>
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
