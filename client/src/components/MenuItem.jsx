import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart, incrementItem, decrementItem, removeItem } from '../slices/cartSlice'

function MenuItem({ item }) {
  const [quantity, setQuantity] = useState('Add')
  const dispatch = useDispatch()
  const payload = { ...item }

  function increment() {
    if (quantity === 'Add') {
      dispatch(addToCart(payload))
      setQuantity(1)
    } else {
      dispatch(incrementItem(payload))
      setQuantity((current) => current + 1)
    }
  }

  function decrement() {
    if (quantity === 'Add') return

    if (quantity === 1) {
      dispatch(removeItem(payload))
      setQuantity('Add')
      return
    }
    dispatch(decrementItem(payload))
    setQuantity((current) => current - 1)
  }

  return (
    <div className='menu-item'>
      <img src={item.img} alt='img' />
      <p>{item.name}</p>
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
