import './styles/home.css'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getRestaurants } from '../requests'
import { useDispatch } from 'react-redux'
import { setFocusedRestaurant } from '../slices/restaurantSlice'

export function Home() {
  const [restaurants, setRestaurants] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  function showMenu(restaurant) {
    const restaurantId = restaurant.restaurant_id
    dispatch(setFocusedRestaurant(restaurant))
    navigate(`/menu/${restaurantId}`)
  }

  useEffect(() => {
    ;(async () => {
      const restaurantList = await getRestaurants()
      console.log('restaurantList:', restaurantList)
      setRestaurants(() => restaurantList)
    })()
  }, [])

  return (
    <div id='home'>
      <div id='nav-div'>
        <Link to='/signup'>signup </Link>
        <Link to='/login'>login</Link>
      </div>
      <div id='restarunats'>
        {restaurants.map((restaurant, index) => {
          return (
            <div onClick={() => showMenu(restaurant)} key={index}>
              <img src={restaurant.img} alt='img' />
              <p>{restaurant.name}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
