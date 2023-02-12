import { getRestaruants, getRestaruant, getMenu } from '../models/restaurants.js'

export async function getRestaurantsList(req, res) {
  try {
    const restaurants = await getRestaruants()
    return res.json(restaurants)
  } catch (err) {
    return res.status(500).json({ msg: 'unable to get restaurants' })
  }
}

export async function getRestaurant(req, res) {
  try {
    const restaurantId = req.params.restaurantId

    const restaurant = await getRestaruant(restaurantId)
    if (restaurant.length === 0) {
      return res.status(404).json({ msg: 'restaurant not found' })
    }

    const menu = await getMenu(restaurantId)
    return res.json({ restaurant: restaurant[0], menu })
  } catch (error) {
    res.status(500).json({ msg: 'unable to get restaurants menu' })
  }
}
