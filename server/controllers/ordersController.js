import { placeOrder } from '../models/queries.js'

export async function order(req, res) {
  try {
    let cart = req.body
    if (cart.length === 0) res.status(400).json({ err: 'cannot order, cart is empty' })
    await placeOrder(cart)
    res.json({ msg: 'order placed' })
  } catch (err) {
    console.log('err', err.message)
    res.status(500).json({ err: 'unable to process the order' })
  }
}
