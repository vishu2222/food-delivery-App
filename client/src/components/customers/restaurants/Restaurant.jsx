import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getRestaurant } from '../requests'
import MenuItem from './MenuItem'
import Cart from '../cart/Cart'
import { useSelector } from 'react-redux'
import RestaurantCard from './RestaurantCard'
import Nav from '../Nav'

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

      console.log('restaurant:', response)

      setRestaurant(response.restaurant)
      setMenu(response.menu)
    })()
  }, [restaurantId])

  function gotoCheckOut() {
    if (cart.length === 0) {
      setDisplayMsg('cart empty, add some items')
      return
    }
    navigate('/check-out')
  }

  return (
    <div id='showRestaurantPage' className=' bg-gray-200'>
      <h3>{displayMsg}</h3>
      <Nav />
      <div>
        <RestaurantCard restaurant={restaurant} />

        <div id='items-and-cart' className='flex w-3/5 m-auto'>
          <div id='restaurantMenu' className='py-1 flex flex-col'>
            {menu.map((item, index) => (
              <MenuItem item={item} restaurant={restaurant} key={index} />
            ))}
          </div>

          <div id='cart'>
            <Cart />
            <button onClick={gotoCheckOut}>checkout</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowRestaurant
