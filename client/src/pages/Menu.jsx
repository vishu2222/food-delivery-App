import { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
import { getMenu } from '../requests'
import { useLocation } from 'react-router-dom'

export function Menu() {
  const location = useLocation()
  const restaurantId = location.pathname.split('menu/')[1] // handle err
  const [menu, setMenu] = useState([])

  useEffect(() => {
    ;(async () => {
      const menuList = await getMenu(restaurantId)
      console.log('menuList', menuList)
      setMenu(() => menuList)
    })()
  }, [restaurantId])

  return (
    <div id='menu'>
      {menu.map((item, index) => {
        return (
          <div key={index}>
            <img src={item.img} alt='img' />
            <p>{item.name}</p>
            <p>price: {item.price}</p>
          </div>
        )
      })}
    </div>
  )
}

// let restaurantId = useState(useSelector((state) => state.focusedRestaurant.restaurantId))[0]
// console.log('resId:', restaurantId, typeof restaurantId)
