import { getRestaruants, getRestaurantMenu } from '../models/queries.js'

export async function getRestaruantsList(req, res) {
  try {
    const restaurants = await getRestaruants()
    res.status(200).json({ restaurants })
  } catch (err) {
    res.status(500).json({ err: 'internal server error' })
  }
}

export async function getMenu(req, res) {
  try {
    const menu = await getRestaurantMenu(req.params.id)
    res.status(200).json({ menu })
  } catch (err) {
    res.status(500).json({ err: 'internal server error' })
  }
}
