import React from 'react'

function CartItem({ item }) {
  return (
    <div>
      <strong>{item.item_name} quantity: </strong>
      {item.quantity} ₹{item.quantity * item.price}
    </div>
  )
}

export default CartItem
