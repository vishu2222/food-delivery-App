import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import requests from '../requests.js'
import { formatTime } from '../../utlities/formateTime.js'
import { io } from 'socket.io-client'
import { useDispatch } from 'react-redux'
import Nav from '../Nav.jsx'
import {
  updatePartnerLocation,
  clearDeliveryAddress,
  clearRestaurant,
  clearPartnerLocation
} from '../../../store/actions.js'
import Map from '../../Common/Map.jsx'

const serverUrl = process.env.REACT_APP_ServerUrl

const socket = io(serverUrl, { autoConnect: false, transports: ['websocket'] })

function OrderDetails() {
  const [showMap, setShowMap] = useState(true)
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
  const dispatch = useDispatch()

  // const state = useSelector((state) => state)
  // console.log('state>:', state)
  useEffect(() => {
    dispatch(clearPartnerLocation())
  }, [dispatch])

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
    })()
  }, [orderId])

  useEffect(() => {
    if (orderStatus === 'delivered') {
      // need to disconnect socket
      dispatch(clearRestaurant())
      dispatch(clearDeliveryAddress())
      dispatch(clearPartnerLocation())
      setShowMap(false)
    }
  }, [orderStatus, dispatch])

  useEffect(() => {
    socket.connect()
    socket.on('connect', () => {
      console.log('socket connected')
    })

    socket.on('customer-update', (orderStatus) => {
      setOrderStatus(orderStatus)
    })

    socket.on('partnerLocationUpdate', (location) => {
      dispatch(updatePartnerLocation({ lat: location.lat, lng: location.long }))
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected')
    })

    return () => {
      socket.off('customer-update')
      socket.off('connect')
      socket.off('partnerLocationUpdate')
      socket.off('disconnect')
    }
  }, [dispatch])

  return (
    <div>
      <Nav />
      <div className=' bg-slate-200 pb-32 '>
        <p className=' font-extrabold text-center text-3xl p-4'>Order details</p>
        <div className=' flex justify-center '>
          <div id='orderDetails' className=' p-4 px-10 text-lg font-serif font-medium bg-slate-300 mr-8 '>
            <p>{displayMsg}</p>
            <p className=' p-1 text-xl font-semibold'>Order id: {orderId}</p>
            <p className=' p-1'>Order time: {orderTime}</p>
            <p className=' p-1'>Price: ₹{totalPrice}</p>
            <p className=' p-1'>Status: {orderStatus}</p>
            <p className=' p-1'>Restaurant: {restaurantName}</p>
            <p className=' p-1 text-xl font-semibold'>Order Items</p>

            {orderItems.map((item, index) => (
              <p key={index}>
                {item.item_name}, quantity: {item.quantity}
              </p>
            ))}

            <p className='text-xl font-semibold'>Delivary person: {partnerName}</p>
            <p>Phone: {phone}</p>
          </div>

          {showMap && (
            <div className=' flex p-4 border border-orange-900 h-[50vh] w-full'>
              <Map />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
