import React from 'react'

function CartItem({ item }) {
  console.log('item:', item)
  return (
    <div className='flex justify-between '>
      <p className=' p-4'>{item.item_name} </p>
      <p className=' p-4'>{item.quantity} </p>
      <p className=' p-4'>₹{item.quantity * item.price}</p>
    </div>
  )
}

export default CartItem
