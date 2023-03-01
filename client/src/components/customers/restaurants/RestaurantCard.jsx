import React from 'react'

function RestaurantCard({ restaurant }) {
  return (
    <div id='restaurantCard' className='flex bg-black justify-center'>
      <img src={restaurant.img} alt='' className=' px-4 py-10  h-60 w-60' />

      <div className=' text-white flex flex-col p-4 '>
        <div className=' text-4xl p-2 font-serif'>{restaurant.restaurant_name}</div>
        <div className=' p-2 font-serif'>
          <span>Location: </span>
          {restaurant.address}, {restaurant.city}
        </div>
        <div className=' p-2 font-serif'>Phone: {restaurant.phone}</div>
        <div className='p-2 font-serif'>
          {restaurant.start_time} - {restaurant.close_time}
        </div>
      </div>
    </div>
  )
}

export default RestaurantCard
