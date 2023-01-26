import React from 'react'
import './styles/cart.css'
import { useSelector } from 'react-redux'
import CartItem from './CartItem'

function Cart() {
  const cart = useSelector((state) => state.cartItems.cart)
  const total = cart.reduce((sum, item) => sum + item.count * item.price, 0)

  return (
    <div id='cart'>
      <p>Cart</p>
      {cart.map((item, index) => {
        return <CartItem key={index} cartItem={item} />
      })}
      <p>
        <strong>Total:</strong> {total}
      </p>
    </div>
  )
}

export default Cart
