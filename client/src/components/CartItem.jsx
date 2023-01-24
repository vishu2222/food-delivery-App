import React from 'react'

function CartItem({ cartItem }) {
  console.log('from cartItem:', cartItem)
  return (
    <div>
      <strong>{cartItem.name} quantity: </strong> {cartItem.count} ₹
      {cartItem.count * cartItem.price}
    </div>
  )
}

export default CartItem
