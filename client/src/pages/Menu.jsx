import { useEffect, useState } from 'react'
import { getMenu } from '../requests'
import { useSelector } from 'react-redux'
import { placeOrder } from '../requests'
import MenuItem from '../components/MenuItem'
import Cart from '../components/Cart.jsx'

export function Menu() {
  const [menu, setMenu] = useState([])
  const [displayStatus, setDisplayStatus] = useState(false)
  const [displayMsg, setDisplayMsg] = useState('')
  const restaurant = useSelector((state) => state.focusedRestaurant.restaurant)
  const restaurantId = restaurant.restaurant_id
  console.log('focusedRestaurant:', restaurant)
  const cartItems = useSelector((state) => state.cartItems.cart) //

  useEffect(() => {
    ;(async () => {
      const menuList = await getMenu(restaurantId)
      console.log('menuList', menuList)
      setMenu(() => menuList)
    })()
  }, [restaurantId])

  async function order() {
    setDisplayMsg('processing order...')
    setDisplayStatus(true)
    const status = await placeOrder(cartItems)
    if (status !== 200) {
      setDisplayMsg('unable to place order')
    } else {
      setDisplayMsg('order placed')
    }

    // // console.log('...', cartItems)
    // let orderCart = JSON.parse(JSON.stringify(cartItems))
    // console.log('orderCart', orderCart)
    // // orderCart = orderCart.map((item) => Object.create({ ...item }))
    // placeOrder(orderCart)
  }

  return (
    <div id='menu-page'>
      <div id='focused-restaurant'>{restaurant.name}</div>

      <div id='menu-items'>
        {menu.map((item, index) => (
          <MenuItem item={item} key={index} />
        ))}
      </div>
      {displayStatus && <h2>{displayMsg}</h2>}
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
