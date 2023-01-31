import './styles/home.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getRestaurants } from '../requests'
import { setFocusedRestaurant } from '../store/actions'

export default function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [restaurants, setRestaurants] = useState([])

  useEffect(() => {
    ;(async () => {
      const restaurantList = await getRestaurants()
      console.log('restaurantList:', restaurantList)
      setRestaurants(restaurantList)
    })()
  }, [])

  function showMenu(restaurant) {
    const restaurantId = restaurant.restaurant_id
    dispatch(setFocusedRestaurant(restaurant))
    navigate(`/menu/${restaurantId}`)
  }

  return (
    <div id='home'>
      <div id='restaurants'>
        {restaurants.map((restaurant, index) => {
          return (
            <div onClick={() => showMenu(restaurant)} key={index}>
              <img src={restaurant.img} alt='img' />
              <p>{restaurant.restaurant_name}</p>
              <p>startTime:{restaurant.start_time}</p>
              <p>closeTime:{restaurant.close_time}</p>
              <p>phone:{restaurant.phone}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
