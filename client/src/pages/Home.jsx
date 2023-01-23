import '../styles/Home.css'
import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRestaurants } from '../requests'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setFocusedRestaurant } from '../slices/restaurantSlice'

export function Home() {
  const [restaurants, setRestaurants] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  function showMenu(restaurantId) {
    dispatch(setFocusedRestaurant(restaurantId))
    navigate(`/menu/${restaurantId}`)
  }

  useEffect(() => {
    // add named function function
    ;(async () => {
      const restaurantList = await getRestaurants()
      console.log(restaurantList)
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
            <div onClick={() => showMenu(restaurant.restaurant_id)} key={index}>
              <img src={restaurant.img} alt='img' />
              <p>{restaurant.name}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
