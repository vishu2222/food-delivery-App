import socket from '../../sockets.js'
import { restaurantMap, partnerMap, customerMap } from '../../models/socketMap.js'
import { addOrderItemNames } from './addOrderItemNames.js'

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

export function notifyRestaurant(notification) {
  try {
    const io = socket.get()

    if (notification.type === 'new-order') {
      io.to(restaurantMap[notification.restaurantId]).emit('new-order', notification.order)
    }

    if (notification.type === 'update') {
      io.to(restaurantMap[notification.restaurantId]).emit('restaurant-update', {
        status: notification.orderStatus,
        order_id: notification.orderId
      })
    }
  } catch (err) {
    //
  }
}

export function notifyPartner(notification) {
  try {
    const io = socket.get()
    if (notification.type === 'pickup') {
      io.to(partnerMap[notification.partnerId]).emit('partner-update', {
        status: notification.status,
        ...notification.restaurant,
        order_id: notification.orderId,
        total_price: notification.orderAmount
      })
    }
  } catch (err) {
    //
  }
}

export function notifyCustomer(notification) {
  try {
    const io = socket.get()
    if (notification.type === 'update') {
      io.to(customerMap[notification.customerId]).emit('customer-update', notification.orderStatus)
    }
  } catch (err) {
    //
  }
}
