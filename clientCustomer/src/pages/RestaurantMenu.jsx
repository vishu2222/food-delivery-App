import React from 'react'
import { useEffect, useState } from 'react'
import { getMenu, placeOrder } from '../requests'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../store/actions'
import MenuItem from '../components/MenuItem'
import Cart from '../components/Cart'

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

    const finalCart = { restaurantId, customerId: 1, items: [] }
    cartItems.forEach((item) => {
      finalCart.items.push({ itemId: item.item_id, quantity: item.quantity })
    })

    const status = await placeOrder(finalCart)
    if (status !== 201) {
      setDisplayMsg('sorry, unable to place order')
    } else {
      dispatch(clearCart())

      setDisplayMsg('order placed, your food is on the way')
    }
  }

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
