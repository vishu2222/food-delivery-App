import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getRestaurant } from './customerRequests'
import MenuItem from './MenuItem'
import Cart from './Cart'
import { useSelector } from 'react-redux'

// import { io } from 'socket.io-client'

// const socket = io('http://localhost:3000', { autoConnect: false, transports: ['websocket'] })

function ShowRestaurant() {
  const [restaurant, setRestaurant] = useState({})
  const [menu, setMenu] = useState([])
  const [displayMsg, setDisplayMsg] = useState('')

  const location = useLocation()
  const navigate = useNavigate()

  const restaurantId = Number(location.pathname.split('/restaurant/')[1])

  const cart = useSelector((state) => state.cart)

  useEffect(() => {
    ;(async () => {
      const response = await getRestaurant(restaurantId)
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

  //   socket.on('connect', () => {
  //     console.log('socket connected')
  //   })

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
  //     socket.off('connect')
  //   }
  // }, [])

  function gotoCheckOut() {
    if (cart.length === 0) {
      setDisplayMsg('cart empty, add some items')
      return
    }
    navigate('/check-out')
  }

  return (
    <div id='showRestaurantPage'>
      <h3>{displayMsg}</h3>
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

      <div id='cart'>
        <Cart />
        <button onClick={gotoCheckOut}>checkout</button>
      </div>
    </div>
  )
}

export default ShowRestaurant
