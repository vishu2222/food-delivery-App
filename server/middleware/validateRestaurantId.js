export function validateRestaurantId(req, res, next) {
  const restaurantId = req.params.restaurantId
  if (!Number.isInteger(Number(restaurantId))) {
    return res.status(400).json({ err: 'bad request', msg: 'invalid restaurant ID' })
  }
  next()
}
