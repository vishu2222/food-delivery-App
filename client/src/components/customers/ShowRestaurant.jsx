import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getRestaurant, placeOrder } from './customerRequests'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../../store/actions'
import { io } from 'socket.io-client'
import MenuItem from './MenuItem'
import Cart from './Cart'

const socket = io('http://localhost:3000', { autoConnect: false, transports: ['websocket'] })

function ShowRestaurant() {
  const [restaurant, setRestaurant] = useState({})
  const [menu, setMenu] = useState([])
  const [displayMsg, setDisplayMsg] = useState('')
  const dispatch = useDispatch()

  const location = useLocation()
  const restaurantId = location.pathname.split('/restaurant/')[1]
  const cartItems = useSelector((state) => state.cart)
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      const response = await getRestaurant(restaurantId)
      console.log('restaurant', response)
      if (response.msg) {
        setDisplayMsg(response.msg)
        return
      }
      setRestaurant(response.restaurant)
      setMenu(response.menu)
    })()
  }, [restaurantId])

  // useEffect(() => {
  //   socket.connect()
  //   socket.on('restaurant-update', (status) => {
  //     if (status.msg === 'accepted') {
  //       setDisplayMsg(`order confirmed by restaurant, allocating delivary partner...`)
  //     }
  //     if (status.msg === 'declined') {
  //       setDisplayMsg(`order declined by restaurant`)
  //     }
  //     if (status.msg === 'server-err') {
  //       setDisplayMsg(`sorry, unable to get restaurant's confirmation due to internal error`)
  //     }
  //   })
  //   return () => {
  //     socket.off('restaurant-update')
  //   }
  // }, [])

  function gotoCheckOut() {
    navigate('/check-out')
  }

  return (
    <div id='showRestaurantPage'>
      <div id='restaurant'>
        <h3>{restaurant.restaurant_name}</h3>
        <img src={restaurant.img} alt='img' />
        <h3>address {restaurant.address}</h3>
        <h3>city {restaurant.city}</h3>
        <h3>start time {restaurant.start_time}</h3>
        <h3>close time {restaurant.close_time}</h3>
        <h3>Phone {restaurant.phone}</h3>
      </div>
      <h2>Menu</h2>
      <div id='restaurantMenu'>
        {menu.map((item, index) => (
          <MenuItem item={item} restaurantId={restaurantId} key={index} />
        ))}
      </div>
      <h3>{displayMsg}</h3>

      <div id='cart'>
        <Cart />
        <button onClick={gotoCheckOut}>checkout</button>
      </div>
    </div>
  )
}

export default ShowRestaurant
