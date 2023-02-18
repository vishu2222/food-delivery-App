import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, incrementCartItem, decrementCartItem, removeCartItem, setRestaurantId } from '../../store/actions'

function MenuItem({ item, restaurantId }) {
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(0)
  const itemId = item.item_id

  const payload = { ...item }

  const cartitem = useSelector((state) => state.cart).find((item) => item.item_id === itemId)

  useEffect(() => {
    if (cartitem !== undefined) {
      setQuantity(cartitem.quantity)
      return
    }
    setQuantity(0)
  }, [cartitem])

  function increment() {
    if (quantity === 0) {
      dispatch(setRestaurantId(restaurantId))
      dispatch(addToCart(payload))
      return
    }
    dispatch(incrementCartItem(payload))
  }

  function decrement() {
    if (quantity > 1) {
      dispatch(decrementCartItem(payload))
      return
    }
    dispatch(removeCartItem(payload))
  }

  return (
    <div className='menu-item'>
      <img src={item.img} alt='img' />
      <p>{item.item_name}</p>
      <p>price: {item.price}</p>
      <p>
        <button onClick={decrement}>-</button>
        {quantity || 'Add'}
        <button onClick={increment}>+</button>
      </p>
    </div>
  )
}

export default MenuItem
