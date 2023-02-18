import React, { useState } from 'react'
import Items from './Items'
import { updateOrder } from './requests/restaurantRequests'

function Order({ order, index }) {
  const orderId = order.order_id
  const orderItems = order.order_items
  const orderTime = order.order_time
  const [status, setStatus] = useState(order.status)
  const totalPrice = order.total_price

  async function confirmOrder(confirmation) {
    let status = 'searching for delivery partner'
    if (confirmation === 'reject') {
      status = 'restaurant rejected'
    }

    const [responseStatus, orderStatus] = await updateOrder(orderId, status)

    if (responseStatus !== 200) {
      //
    }
    setStatus(orderStatus.msg)
  }

  return (
    <div>
      <h3>{index + 1}.Order Details</h3>
      <p>order Time: {orderTime}</p>
      <p>Status: {status}</p>
      <p>Total price: ₹{totalPrice}</p>
      {orderItems.map((item, index) => {
        return (
          <div key={index}>
            <Items item={item} />
          </div>
        )
      })}
      <button onClick={() => confirmOrder('accept')}>Accept</button>
      <button onClick={() => confirmOrder('reject')}>Reject</button>
    </div>
  )
}

export default Order
