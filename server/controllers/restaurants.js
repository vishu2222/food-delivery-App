import { getRestaruants, getRestaruant, getMenu } from '../models/restaurants.js'

export async function getRestaurantsList(req, res) {
  try {
    const restaurants = await getRestaruants()
    return res.json({ data: restaurants, status: 'success' })
  } catch (err) {
    return res.status(500).json({ err: 'internal server error', msg: 'unable to get restaurants' })
  }
}

export async function getRestaurantsMenu(req, res) {
  try {
    const restaurantId = req.params.restaurantId

    const restaturant = await getRestaruant(restaurantId)
    if (restaturant.length === 0) {
      return res.status(404).json({ err: 'bad request', msg: 'restaurant not found' })
    }

    const menu = await getMenu(restaurantId)
    return res.json({ data: menu, status: 'success' })
  } catch (error) {
    res.status(500).json({ err: 'internal server error', msg: 'unable to get menu' })
  }
}
