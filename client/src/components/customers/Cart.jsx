import React from 'react'
import CartItem from './CartItem'

import { useSelector } from 'react-redux'

function Cart() {
  const cart = useSelector((state) => state.cart)
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return (
    <div id='cart'>
      <p>Cart</p>
      {cart.map((item, index) => {
        return <CartItem key={index} item={item} />
      })}
      <p>
        <strong>Total:</strong> ₹{total}
      </p>
    </div>
  )
}

export default Cart
