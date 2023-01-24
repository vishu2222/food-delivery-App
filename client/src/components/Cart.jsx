import React from 'react'
import './styles/cart.css'
import { useDispatch, useSelector } from 'react-redux'
// import { incrementItem } from '../slices/cartSlice'
import CartItem from './CartItem'

function Cart() {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cartItems.cart)

  return (
    <div id='cart'>
      <p>Cart</p>
      {cart.map((item, index) => {
        return <CartItem key={index} cartItem={item} />
      })}
    </div>
  )
}

export default Cart
