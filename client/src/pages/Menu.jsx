import { useEffect, useState } from 'react'
import { getMenu, placeOrder } from '../requests'
import { useSelector } from 'react-redux'
import MenuItem from '../components/MenuItem'
import Cart from '../components/Cart.jsx'

export function Menu() {
  const [menu, setMenu] = useState([])
  const [displayMsg, setDisplayMsg] = useState('')
  const restaurant = useSelector((state) => state.focusedRestaurant.restaurant)
  const restaurantId = restaurant.restaurant_id
  console.log('focusedRestaurant:', restaurant)
  const cartItems = useSelector((state) => state.cartItems.cart) //

  useEffect(() => {
    ;(async () => {
      const menuList = await getMenu(restaurantId)
      console.log('menuList', menuList)
      setMenu(menuList)
    })()
  }, [restaurantId])

  async function order() {
    setDisplayMsg('processing order...')
    const status = await placeOrder(cartItems)
    if (status !== 200) {
      setDisplayMsg('sorry, unable to place order')
    } else {
      setDisplayMsg('order placed, your food is on the way')
    }
  }

  return (
    <div id='menu-page'>
      <div id='focused-restaurant'>{restaurant.name}</div>

      <div id='menu-items'>
        {menu.map((item, index) => (
          <MenuItem item={item} key={index} />
        ))}
      </div>
      {<h2>{displayMsg}</h2>}
      <div id='cart'>
        <Cart />
        <button onClick={order}>Place order</button>
      </div>
    </div>
  )
}

// import { useSelector } from 'react-redux'
// let restaurantId = useState(useSelector((state) => state.focusedRestaurant.restaurantId))[0]
// console.log('resId:', restaurantId, typeof restaurantId)

// import { useLocation } from 'react-router-dom'
//const location = useLocation()
//const restaurantId = location.pathname.split('menu/')[1]
