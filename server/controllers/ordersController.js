import { placeOrder } from '../models/queries.js'

export async function createOrder(req, res) {
  try {
    let cart = req.body
    if (cart.length === 0) return res.status(400).json({ err: 'cannot order, cart is empty' })
    await placeOrder(cart)
    return res.json({ msg: 'order placed' })
  } catch (err) {
    return res.status(500).json({ err: 'unable to process the order' })
  }
}
