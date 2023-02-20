import { getSessionUserDetails } from '../models/sessions.js'

export async function auth(req, res, next) {
  try {
    if (req.cookies === undefined || req.cookies.sessionId === undefined) {
      return res.sendStatus(401)
    }

    const sessionId = req.cookies.sessionId
    const session = await getSessionUserDetails(sessionId)

    req.userId = session.user_id
    req.userRole = session.user_type
    req.customerId = session.customer_id
    req.restaurantId = session.restaurant_id
    req.partnerId = session.partner_id
    req.sessionId = sessionId

    next()
  } catch (error) {
    if (error.message === 'sessionDoesntExist') {
      return res.sendStatus(401)
    }
    return res.sendStatus(500)
  }
}
