import { React, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { getAllOrders } from './requests/restaurantRequests'
import Order from './Order'
import { useNavigate } from 'react-router-dom'
import { formatTime } from '../utlities/formateTime'
import { useToast } from '@chakra-ui/react'

const socket = io('http://localhost:3000', { autoConnect: false, transports: ['websocket'] })

function RestaurantHome() {
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      let [status, ordersList] = await getAllOrders()
      console.log('status', status)
      if (status !== 200) {
        console.log('status', status)
        navigate('/login')
        return
      }

      ordersList = ordersList.map((order) => {
        order.order_time = formatTime(order.order_time)
        return order
      })

      console.log(ordersList)
      setOrders(ordersList)
    })()
  }, [navigate])

  function updateOrder(orderId, orderStatus) {
    const updatedOrders = orders.map((order) => {
      if (order.order_id === Number(orderId)) {
        order['status'] = orderStatus
        return order
      }
      return order
    })

    setOrders(updatedOrders)
  }

  useEffect(() => {
    socket.connect()

    socket.on('connect', () => {
      console.log('restaurant socket connected')
    })

    socket.on('new-order', (order) => {
      order.order_time = formatTime(order.order_time)
      setOrders((currentOrders) => [order, ...currentOrders])
    })

    socket.on('restaurant-update', (notification) => {
      updateOrder(notification.order_id, notification.status)
    })

    return () => {
      socket.off('connect')
      socket.off('new-order')
      socket.off('restaurant-update')
    }
  }, [orders])

  return (
    <div className='flex flex-col items-center p-4 h-screen bg-slate-400'>
      <h2 className='text-b text-3xl font-extrabold'>ORDERS</h2>
      <div className=' bg-slate-100'>
        {orders.map((order, index) => {
          return (
            <div key={index}>
              <Order order={order} index={index} key={order.status + index} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RestaurantHome
