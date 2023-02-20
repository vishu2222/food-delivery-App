import { Server } from 'socket.io'
import { restaurantMap, partnerMap, customerMap } from './models/socketMap.js'
import { getSessionUserDetails } from './models/sessions.js'

let io
let count = 0
export default {
  init: (httpServer) => {
    io = new Server(httpServer, { cors: { origin: ['http://localhost:3001'] }, cookie: true, httpOnly: true })

    io.use(async (socket, next) => {
      try {
        const sessionId = socket.handshake.headers.cookie.split('sessionId=')[1]
        const session = await getSessionUserDetails(sessionId)

        if (session.user_type === 'restaurant') {
          restaurantMap[session.restaurant_id] = socket.id
        }

        if (session.user_type === 'customer') {
          customerMap[session.customer_id] = socket.id
        }

        if (session.user_type === 'delivery_partner') {
          partnerMap[session.partner_id] = socket.id
        }

        next()
      } catch (error) {
        return next(new Error('unauthorised'))
      }
    })

    io.on('connection', (socket) => {
      count++
      console.log('socket count', count)

      socket.on('disconnect', () => {
        count--
      })
    })
  },

  get: () => {
    if (io) {
      return io
    }
    throw new Error('socket not initialized')
  }
}

// socket.userId = session.user_id
// socket.userRole = session.user_type
// socket.customerId = session.customer_id
// socket.restaurantId = session.restaurant_id
// socket.partnerId = session.partner_id
// socket.sessionId = sessionId
