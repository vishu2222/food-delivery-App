import React from 'react'
import { useEffect, useState } from 'react'
import { getMenu, placeOrder } from '../requests'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../store/actions'
import MenuItem from '../components/MenuItem'
import Cart from '../components/Cart'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', { autoConnect: false, transports: ['websocket'] })

function RestaurantMenu() {
  const [menu, setMenu] = useState([])
  const [displayMsg, setDisplayMsg] = useState('')
  const dispatch = useDispatch()

  const location = useLocation()
  const restaurantId = location.pathname.split('/menu/')[1]

  const restaurant = useSelector((state) => state.focusedRestaurant)
  const cartItems = useSelector((state) => state.cart)

  useEffect(() => {
    ;(async () => {
      const menuList = await getMenu(restaurantId)
      console.log('resMenu: menuList', menuList)
      setMenu(menuList)
    })()
  }, [restaurantId])

  async function createOrder() {
    setDisplayMsg('processing order...')

    const customerId = 1
    const addressId = 1
    const finalCart = { restaurantId, addressId, items: [] }
    cartItems.forEach((item) => {
      finalCart.items.push({ itemId: item.item_id, quantity: item.quantity })
    })

    const [status, orderId] = await placeOrder(finalCart, customerId)
    if (status !== 201) {
      setDisplayMsg('sorry, unable to place order')
    } else {
      dispatch(clearCart())
      setDisplayMsg(`order placed. Order id:${orderId} , awaiting restaurant confirmation`)
    }
  }

  useEffect(() => {
    socket.connect()
    socket.on('restaurant-update', (status) => {
      if (status.msg === 'accepted') {
        setDisplayMsg(`order confirmed by restaurant, allocating delivary partner...`)
      }
      if (status.msg === 'declined') {
        setDisplayMsg(`order declined by restaurant`)
      }
      if (status.msg === 'server-err') {
        setDisplayMsg(`sorry, unable to get restaurant's confirmation due to internal error`)
      }
    })
    return () => {
      socket.off('restaurant-update')
    }
  }, [])

  return (
    <div id='menu-page'>
      <div id='focused-restaurant'>Restaurant-Name: {restaurant.restaurant_name}</div>
      <div id='menu-items'>
        {menu.map((item, index) => (
          <MenuItem item={item} key={index} />
        ))}
      </div>
      {<h2>{displayMsg}</h2>}
      <div id='cart'>
        <Cart />
        <button onClick={createOrder}>Place order</button>
      </div>
    </div>
  )
}

export default RestaurantMenu
