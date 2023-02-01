import React from 'react'
import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'
import { confirmOrder } from '../requests'

const socket = io('http://localhost:3000', { autoConnect: false, transports: ['websocket'] })

function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    orders.forEach((order) => {
      console.log('orderItems', order.orderItems)
      order.orderItems.forEach((item) => {
        console.log('item:', item)
      })
    })
  }, [orders])

  useEffect(() => {
    socket.connect()

    socket.on('connect', () => {
      console.log('socket connected')
    })

    socket.on('new-order', (order) => {
      setOrders((current) => [...current, order])
    })

    return () => {
      socket.off('connect')
      socket.off('new-order')
    }
  }, [])

  function acceptOrder(order) {
    console.log(order)
    const orderId = order.orderId
    confirmOrder(orderId, 'accept')
  }

  function declineOrder(order) {
    const orderId = order.orderId
    confirmOrder(orderId, 'decline')
    // socket.emit('decline-order', { resId: order.resId, customerId: order.customerId })
  }

  const renderOrders = orders.map((order, index) => {
    return (
      <div key={index}>
        <p>New Order</p>
        {order.orderItems.map((item, itemIndex) => {
          return (
            <div key={itemIndex}>
              <p>
                itemId: {item.itemId} itemQuantity: {item.quantity}
              </p>
            </div>
          )
        })}
        <button onClick={() => acceptOrder(order)}>confirm order</button>
        <button onClick={() => declineOrder(order)}>decline order</button>
      </div>
    )
  })

  return (
    <div>
      <p>Orders</p>
      <br />
      <br />
      {renderOrders}
    </div>
  )
}

export default Orders
