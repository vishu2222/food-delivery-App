import React from 'react'
import { BiFoodTag } from 'react-icons/bi'

function MenuCard({ item, increment, decrement, quantity }) {
  let veg
  if (item.category === 'veg') {
    veg = true
  }
  return (
    <div className='flex m-1'>
      <div className='flex flex-col w-1/2'>
        {veg ? <BiFoodTag className=' text-green-800 w-5 h-5' /> : <BiFoodTag className=' text-red-800 w-5 h-5' />}

        <p className=' text-lg p-2 font-bold'>{item.item_name}</p>
        <p className='p-2'>₹ {item.price}</p>
        <p className='p-2 font-extralight text-gray-500'>{item.description}</p>
      </div>

      <div className=''>
        <img src={item.img} alt='img' />
        <p>
          <button onClick={decrement}>-</button>
          {quantity || 'Add'}
          <button onClick={increment}>+</button>
        </p>
      </div>
    </div>
  )
}

export default MenuCard

//

// <div class='flex justify-center'>
//       <div class='flex flex-col rounded-lg bg-white shadow-lg dark:bg-neutral-700 md:max-w-xl md:flex-row'>
//         <img
//           class='h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg'
//           src={item.img}
//           alt=''
//         />
//         <div class='flex flex-col justify-start p-6'>
//           <h5 class='mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50'>Card title</h5>
//           <p class='mb-4 text-base text-neutral-600 dark:text-neutral-200'>
//             This is a wider card with supporting text below as a natural lead-in to additional content. This content is
//             a little bit longer.
//           </p>
//           <p class='text-xs text-neutral-500 dark:text-neutral-300'>Last updated 3 mins ago</p>
//         </div>
//       </div>
//     </div>
