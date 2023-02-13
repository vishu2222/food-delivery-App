import { getSessionUserDetails } from '../models/sessions.js'

export async function auth(req, res, next) {
  try {
    if (req.cookies === undefined || req.cookies.sessionId === undefined) {
      return res.sendStatus(401)
    }

    const sessionId = req.cookies.sessionId
    const session = await getSessionUserDetails(sessionId)

    if (session.session_id !== sessionId) return res.sendStatus(401)

    // console.log(session)
    req.userName = session.user_name
    req.userRole = session.user_type
    req.customerId = session.customer_id
    req.restaurant_id = session.restaurant_id
    req.partner_id = session.partner_id

    next()
  } catch (error) {
    console.log('auth:', error)
    if (error.message === 'sessionDoesntExist') {
      return res.sendStatus(401)
    }
    return res.sendStatus(500)
  }
}
