export function validateOrderUpdate(orderStatusUpdate, currentStatus, updatedBy, req, res) {
  //
  if (updatedBy === 'restaurant') {
    // only two update options for restaurant
    if (!['restaurant rejected', 'searching for delivery partner'].includes(orderStatusUpdate)) {
      res.status(400).json({ err: `invalid order status update` })
      return false
    }

    // if order is already accepted or rejected, restaurant is not allowed to further update the order
    if (currentStatus !== 'awaiting restaurant confirmation') {
      res.status(400).json({ err: `order already updated, current order status: ${currentStatus}` })
      return false
    }

    return true
  }

  // Only two update options for partner
  if (updatedBy === 'partner') {
    if (!['awaiting delivery', 'delivered'].includes(orderStatusUpdate)) {
      res.status(400).json({ err: 'invalid order status update' })
      return false
    }

    // when current status = 'awaiting pickup' allowed update is only 'awaiting delivery'
    if (currentStatus === 'awaiting pickup' && orderStatusUpdate !== 'awaiting delivery') {
      res.status(400).json({ err: 'order not yet pickedUp' })
      return false
    }

    // when current status = 'awaiting delivery' allowed update is only 'delivered'
    if (currentStatus === 'awaiting delivery' && orderStatusUpdate !== 'delivered') {
      res.status(400).json({ err: 'order can be only be delivered,  other updates not accepted' })
      return false
    }

    // not allowed to further update a delivered order
    if (currentStatus === 'delivered') {
      res.status(400).json({ err: 'order already delivered' })
      return false
    }

    return true
  }
}
