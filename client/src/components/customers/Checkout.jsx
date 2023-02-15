import React from 'react'
import Cart from './Cart'

function Checkout() {
  async function createOrder() {
    // setDisplayMsg('processing order...')
    // const addressId = 1
    // const finalCart = { restaurantId, addressId, items: {} }
    // cartItems.forEach((item) => {
    //   finalCart.items[item.item_id] = item.quantity
    // })
    // const [status, orderId] = await placeOrder(finalCart)
    // if (status !== 201) {
    //   setDisplayMsg('sorry, unable to place order')
    // } else {
    //   dispatch(clearCart())
    //   setDisplayMsg(`order placed. Order id:${orderId} , awaiting restaurant confirmation`)
    // }
  }
  return (
    <div>
      <Cart />
      {/* <h3></h3> */}
      <button onClick={createOrder}>Place order</button>
    </div>
  )
}

export default Checkout
