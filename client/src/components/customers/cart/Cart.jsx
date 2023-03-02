import React from 'react'
import CartItem from './CartItem'

import { useSelector } from 'react-redux'

function Cart() {
  const cart = useSelector((state) => state.cart)
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return (
    <div id='cart' className=' font-serif p-2'>
      <p className=' text-3xl font-extrabold'>Cart </p>
      {cart.map((item, index) => {
        return <CartItem key={index} item={item} />
      })}

      <p className=' p-4'>Total: ₹{total}</p>
    </div>
  )
}

export default Cart
