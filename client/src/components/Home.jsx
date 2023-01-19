import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRestaurants } from '../requests'
import '../styles/Home.css'

export function Home() {
  const [restaurants, setRestaurants] = useState([])

  function showMenu() {}

  useEffect(() => {
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
      <div id='restarunats' onClick={showMenu}>
        {restaurants.map((restaurant, index) => {
          return (
            <div key={index}>
              <img src={restaurant.img} alt='img' />
              <p>{restaurant.name}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
