import './styles/home.css'
import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRestaurants } from './customerRequests'

function CustomerHome() {
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])

  useEffect(() => {
    ;(async () => {
      const restaurantList = await getRestaurants()
      console.log('restaurantList:', restaurantList)
      setRestaurants(restaurantList)
    })()
  }, [])

  return (
    <div id='customerHome'>
      <h2>Restaurants</h2>
      <div id='customerHome-restaurants'>
        {restaurants.map((restaurant, index) => {
          return (
            <div onClick={() => navigate(`/restaurant/${restaurant.restaurant_id}`)} key={index}>
              <img src={restaurant.img} alt='img' />
              <p>{restaurant.restaurant_name}</p>
              <p> start time: {restaurant.start_time}</p>
              <p> close time: {restaurant.close_time}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CustomerHome
