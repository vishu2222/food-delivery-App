import React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, incrementCartItem, decrementCartItem, removeCartItem } from '../../store/actions'

function MenuItem({ item, restaurantId }) {
  // const itemId = item.item_id
  const [quantity, setQuantity] = useState(0)

  const payload = { ...item }

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  // const cartitem = useSelector((state) => state.cart).find((item) => item.item_id === itemId)
  // console.log('cartitem', cartitem)

  function increment() {
    console.log('payload', payload)
    if (quantity === 'Add') {
      dispatch(addToCart(payload))
      setQuantity(1)
    } else {
      dispatch(incrementCartItem(payload))
      setQuantity((current) => current + 1)
    }
  }

  function decrement() {
    if (quantity === 'Add') return
    if (quantity === 1) {
      dispatch(removeCartItem(payload))
      setQuantity('Add')
      return
    }
    dispatch(decrementCartItem(payload))
    setQuantity((current) => current - 1)
  }

  useEffect(() => {
    if (cart.length === 0) {
      setQuantity('Add')
    }
  }, [cart])
  return (
    <div className='menu-item'>
      <img src={item.img} alt='img' />
      <p>{item.item_name}</p>
      <p>price: {item.price}</p>
      <p>
        <button onClick={decrement}>-</button>
        {quantity}
        <button onClick={increment}>+</button>
      </p>
    </div>
  )
}

export default MenuItem
