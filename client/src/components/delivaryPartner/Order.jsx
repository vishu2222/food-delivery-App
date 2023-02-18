import React, { useState } from 'react'
import { updateOrder } from './partnerRequests'

function Order({ order, index }) {
  const orderId = order.order_id

  const orderTime = order.order_time
  const [status, setStatus] = useState(order.status)
  const totalPrice = order.total_price

  async function updateDelivary(statusUpdate) {
    const [responseStatus, orderStatus] = await updateOrder(orderId, statusUpdate)
    if (responseStatus !== 200) {
      //
      return
    }
    setStatus(orderStatus.msg)
  }

  console.log('order', order)

  return (
    <div>
      <h3>{index + 1}.Order Details</h3>
      <p>order status: {status}</p>
      <p>Restaurant name: {order.restaurant_name}</p>
      <p>Restaurant address: {order.address}</p>
      <p>Phone: {order.phone}</p>

      <p>order amount: ₹{totalPrice}</p>
      <button onClick={() => updateDelivary('awaiting delivery')}>click to update pickup</button>
      <button onClick={() => updateDelivary('delivered')}>click to update delivary</button>
    </div>
  )
}

export default Order
