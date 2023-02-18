import Cart from './Cart'
import Addressess from './Addressess'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../../store/actions'
import { placeOrder } from './customerRequests'

function Checkout() {
  const [displayMsg, setDisplayMsg] = useState('')
  const state = useSelector((state) => state)
  const dispatch = useDispatch()

  function processCart(cart) {
    const procedCart = { items: {} }
    cart.forEach((item) => {
      procedCart.items[item.item_id] = item.quantity
    })
    return procedCart
  }

  async function createOrder() {
    setDisplayMsg('processing order...')

    const addressId = state.delivaryAddressId
    if (addressId === null) {
      setDisplayMsg('please select a delivary address')
      return
    }

    const restaurantId = state.restaurantId
    if (restaurantId === null) {
      setDisplayMsg('add items to cart from a restaurant')
    }

    const items = processCart(state.cart)
    const finalCart = { restaurantId, addressId, ...items }

    const [status, orderId] = await placeOrder(finalCart)
    if (status !== 201) {
      setDisplayMsg('sorry, unable to place order')
    } else {
      dispatch(clearCart())
      setDisplayMsg(`order placed. Order id:${orderId} , awaiting restaurant confirmation`)
    }
  }

  return (
    <div>
      <Cart />
      <Addressess />
      <button onClick={createOrder}>place order</button>
      <h3>{displayMsg}</h3>
    </div>
  )
}

export default Checkout