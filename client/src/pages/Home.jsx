import './styles/home.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getRestaurants } from '../requests'
import { focusedRestaurant } from '../slices/restaurantSlice'

export function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [restaurants, setRestaurants] = useState([])

  useEffect(() => {
    ;(async () => {
      const restaurantList = await getRestaurants()
      console.log('restaurantList:', restaurantList)
      setRestaurants(() => restaurantList)
    })()
  }, [])

  function showMenu(restaurant) {
    const restaurantId = restaurant.restaurant_id
    dispatch(focusedRestaurant(restaurant))
    navigate(`/menu/${restaurantId}`)
  }

  return (
    <div id='home'>
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
