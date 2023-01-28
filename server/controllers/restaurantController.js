import { getRestaruants, getRestaurantMenu } from '../models/queries.js'

export async function getRestaruantsList(req, res) {
  try {
    const restaurants = await getRestaruants()
    res.json({ data: restaurants })
  } catch (err) {
    res.status(500).json({ err: 'internal server error' })
  }
}

export async function getMenu(req, res) {
  try {
    const restaurantId = req.params.id
    const menu = await getRestaurantMenu(restaurantId)
    res.json({ data: menu })
  } catch (err) {
    res.status(500).json({ err: 'internal server error' })
  }
}
