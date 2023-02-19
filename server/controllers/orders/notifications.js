import socket from '../../sockets.js'
import { socketMap } from '../../models/socketMap.js'

export async function sendNewOrderNotification(cartItems, order_time, totalAmount, restaurantId, order_id) {
  cartItems = await addOrderItemNames(cartItems)

  cartItems = {
    order_time,
    order_items: cartItems,
    total_price: totalAmount,
    status: 'awaiting restaurant confirmation'
  }

  let notification = {
    type: 'new-order',
    restaurantId,
    order: { order_id, ...cartItems }
  }

  notifyRestaurant(notification)
}

export function notifyPartner(notification) {
  try {
    const io = socket.get()
    if (notification.type === 'pickup') {
      io.emit('partner-update', {
        orderStatus: notification.status,
        ...notification.restaurant,
        orderId: notification.orderId
      })
    }
  } catch (err) {
    //
  }
}

export function notifyRestaurant(notification) {
  try {
    const io = socket.get()

    if (notification.type === 'new-order') {
      io.emit('new-order', notification.order)
    }

    if (notification.type === 'update') {
      io.emit('restaurant-update', notification.orderStatus) //
    }
  } catch (err) {
    //
  }
}

export function notifyCustomer(notification) {
  try {
    const io = socket.get()
    io.emit('customer-update', notification.msg)
  } catch (err) {
    //
  }
}
