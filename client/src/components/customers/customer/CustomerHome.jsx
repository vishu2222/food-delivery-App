import React from 'react'
import { useState, useEffect } from 'react'
import { getRestaurants } from '../requests'
import Nav from '../Nav'
import RestaurantCard from './RestaurantCard'

function CustomerHome() {
  const [restaurants, setRestaurants] = useState([])

  useEffect(() => {
    ;(async () => {
      const restaurantList = await getRestaurants()
      console.log('restaurantList:', restaurantList)
      setRestaurants(restaurantList)
    })()
  }, [])

  return (
    <div className=' bg-gray-100 '>
      <Nav />
      <div className=' w-4/5 m-auto'>
        <div>
          <h2 className=' text-2xl font-mono font-extrabold border-b-2 m-auto mb-6'>
            {restaurants.length} Restaurants
          </h2>
        </div>
        <div id='customerHome' className='grid grid-cols-5 gap-5 justify-center'>
          {restaurants.map((restaurant, index) => (
            <RestaurantCard restaurant={restaurant} key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CustomerHome
