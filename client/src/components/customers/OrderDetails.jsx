import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import requests from './customerRequests.js'
import { formatTime } from '../utlities/formateTime.js'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', { autoConnect: false, transports: ['websocket'] })

function OrderDetails() {
  const [displayMsg, setDisplayMsg] = useState('')
  const location = useLocation()
  const orderId = Number(location.pathname.split('order-details/')[1])
  const [orderItems, setOrderItems] = useState([])
  const [orderTime, setOrderTime] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [phone, setPhone] = useState('')
  const [restaurantName, setRestaurantName] = useState('')
  const [orderStatus, setOrderStatus] = useState('awaiting restaurants confirmation')
  const [totalPrice, setTotalPrice] = useState('')

  useEffect(() => {
    ;(async () => {
      const [status, response] = await requests.getOrderDetails(orderId)
      if (status !== 200) {
        setDisplayMsg('unable to get order details')
        return
      }
      setOrderItems(response.order_items)
      setOrderTime(formatTime(response.order_time))
      setPartnerName(response.partner_name)
      setPhone(response.phone)
      setRestaurantName(response.restaurant_name)
      setOrderStatus(response.status)
      setTotalPrice(response.total_price)

      console.log(response)
    })()
  }, [orderId])

  useEffect(() => {
    socket.connect()
    socket.on('connect', () => {
      console.log('socket connected')
    })

    // socket.on('restaurant-update', (status) => {
    //   if (status.msg === 'accepted') {
    //     setDisplayMsg(`order confirmed by restaurant, allocating delivary partner...`)
    //   }
    //   if (status.msg === 'declined') {
    //     setDisplayMsg(`order declined by restaurant`)
    //   }
    //   if (status.msg === 'server-err') {
    //     setDisplayMsg(`sorry, unable to get restaurant's confirmation due to internal error`)
    //   }
    // })

    return () => {
      socket.off('restaurant-update')
      socket.off('connect')
    }
  }, [])

  return (
    <div>
      <h2>OrderDetails</h2>
      <p>{displayMsg}</p>
      <p>Id: {orderId}</p>
      <p>Order time: {orderTime}</p>
      <p>Price: ₹{totalPrice}</p>
      <p>Status: {orderStatus}</p>
      <p>Restaurant: {restaurantName}</p>
      <p>Items</p>
      {orderItems.map((item, index) => (
        <p key={index}>
          {item.item_name}, quantity: {item.quantity}
        </p>
      ))}
      <p>Delivary person: {partnerName}</p>
      <p>Phone: {phone}</p>
    </div>
  )
}

export default OrderDetails
