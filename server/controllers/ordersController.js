import { confirmOrder, getCustomersAddress } from '../models/queries.js'
import socket from '../sockets/sockets.js'

export async function restaurantsOrderUpdate(req, res) {
  try {
    const orderId = req.params.order_id
    // console.log('orderId:', orderId)
    const confirmation = req.body.confirmation
    const io = socket.get()
    if (confirmation === 'decline') {
      io.emit('restaurant-update', { msg: 'declined' }) // io.to()
      return res.json({ msg: 'order declined', status: 'success' })
    }

    await confirmOrder(orderId)
    io.emit('restaurant-update', { msg: 'accepted' }) // io.to()
    // io.emit() tell restaurant to start cooking
    findDelivaryPartner(orderId)
    res.json({ msg: 'order confirmed', status: 'success' })
  } catch (err) {
    const io = socket.get()
    io.emit('restaurant-update', { msg: 'server-err' })
    return res.status(500).json({ err: 'internal error', msg: 'unable to confirm order' })
  }
}

async function findDelivaryPartner(orderId) {
  const address = await getCustomersAddress(orderId)
  console.log('address:', address)
}
