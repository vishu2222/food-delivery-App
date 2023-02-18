import { React, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { getAllOrders } from './requests/restaurantRequests'
import Order from './Order'
import { useNavigate } from 'react-router-dom'
import { formatTime } from '../utlities/formateTime'
// import { useSelector } from 'react-redux'

const socket = io('http://localhost:3000', { autoConnect: false, transports: ['websocket'] })

function RestaurantHome() {
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()
  // const userType = useSelector((state) => state.userType)

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
      console.log('restaurant socket connected')
    })

    socket.on('new-order', (order) => {
      order.order_time = formatTime(order.order_time)
      setOrders((currentOrders) => [order, ...currentOrders])
    })

    return () => {
      socket.off('connect')
      socket.off('new-order')
    }
  }, [orders])

  return (
    <div>
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

export default RestaurantHome
