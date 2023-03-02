import Cart from '../cart/Cart'
import Addressess from '../address/Addressess'

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../../../store/actions'
import { placeOrder } from '../requests'
import { useNavigate } from 'react-router-dom'
import Nav from '../Nav'

function Checkout() {
  const [displayMsg, setDisplayMsg] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  function processCart(cart) {
    const processedCart = { items: {} }
    cart.forEach((item) => {
      processedCart.items[item.item_id] = item.quantity
    })
    return processedCart
  }

  const state = useSelector((state) => state)

  async function createOrder() {
    setDisplayMsg('processing order...')

    if (state.delivaryAddress === undefined) {
      setDisplayMsg('please select a delivary address')
      return
    }

    const addressId = state.delivaryAddress.address_id
    const restaurantId = state.restaurant.restaurant_id

    if (restaurantId === null) {
      setDisplayMsg('add items to cart from a restaurant')
    }

    const items = processCart(state.cart)
    const finalCart = { restaurantId, addressId, ...items }

    const [status, orderId] = await placeOrder(finalCart)
    if (status !== 201) {
      setDisplayMsg('sorry, unable to place order')
      return
    }

    dispatch(clearCart())
    navigate(`../order-details/${orderId}`)
  }

  return (
    <div>
      <Nav />

      <div className=' p-8 bg-black sticky top-0'></div>

      <div id='checkout' className='flex flex-col items-center  bg-slate-300 h-screen'>
        <Addressess />
        <div id='cart' className='p-5 flex flex-col w-1/6 h-1/12'>
          {/* <Cart /> */}
        </div>
        <button className=' text-white font-serif bg-gray-600 rounded-full cursor-pointer p-2' onClick={createOrder}>
          place order
        </button>
        <p className=' text-red-400 p-2'>{displayMsg}</p>
      </div>
    </div>
  )
}

export default Checkout
