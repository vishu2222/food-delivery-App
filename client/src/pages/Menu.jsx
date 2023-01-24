import { useEffect, useState } from 'react'
import { getMenu } from '../requests'
import { useLocation } from 'react-router-dom'
import MenuItem from '../components/MenuItem'
import { useSelector, useDispatch } from 'react-redux'
import Cart from '../components/Cart.jsx'

export function Menu() {
  const location = useLocation()
  const restaurantId = location.pathname.split('menu/')[1] // handle err
  const [menu, setMenu] = useState([])
  const restaurant = useSelector((state) => state.focusedRestaurant.restaurant)
  console.log('focusedRestaurant:', restaurant)

  useEffect(() => {
    ;(async () => {
      const menuList = await getMenu(restaurantId)
      console.log('menuList', menuList)
      setMenu(() => menuList)
    })()
  }, [restaurantId])

  return (
    <div id='menu-page'>
      <div id='focused-restaurant'>{restaurant.name}</div>

      <div id='menu-items'>
        {menu.map((item, index) => (
          <MenuItem item={item} key={index} />
        ))}
      </div>
      <div id='cart'>
        <Cart />
      </div>
    </div>
  )
}

// import { useSelector } from 'react-redux'
// let restaurantId = useState(useSelector((state) => state.focusedRestaurant.restaurantId))[0]
// console.log('resId:', restaurantId, typeof restaurantId)
