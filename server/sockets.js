import { Server } from 'socket.io'
import { restaurantMap, customerMap, assignedPartnerMap, unassignedPartnerMap } from './models/socketMap.js'
import { unassignedPartnerLocations } from './models/partnerLiveLocations.js'
import { getSessionUserDetails } from './models/sessions.js'
import { isPartnerAssigned } from './models/orders.js'

let io
export default {
  init: (httpServer) => {
    io = new Server(httpServer, { cors: { origin: ['http://localhost:3001'] }, cookie: true, httpOnly: true })

    io.use(async (socket, next) => {
      try {
        const sessionId = socket.handshake.headers.cookie.split('sessionId=')[1]
        const session = await getSessionUserDetails(sessionId)
        // console.log(session)

        if (session.user_type === 'restaurant') {
          restaurantMap[session.restaurant_id] = socket.id
          socket.restaurantId = session.restaurant_id
        }

        if (session.user_type === 'customer') {
          customerMap[session.customer_id] = socket.id
          socket.customerId = session.customer_id
        }

        if (session.user_type === 'delivery_partner') {
          //use switch instead of if
          socket.partnerId = session.partner_id
          const [assigned, order] = await isPartnerAssigned(session.partner_id)

          if (assigned) {
            assignedPartnerMap[session.partner_id] = socket.id
            socket.restaurantId = order.restaurant_id
            socket.customerId = order.customer_id
          } else {
            unassignedPartnerMap[session.partner_id] = socket.id
          }
        }

        next()
      } catch (error) {
        return next(new Error('unauthorised'))
      }
    })

    io.on('connection', (socket) => {
      socket.on('partnerLiveLocation', async (location) => {
        try {
          if (unassignedPartnerMap[socket.partnerId]) {
            // i.e, is socket-partner is not assigned an order

            unassignedPartnerLocations[socket.partnerId] = { latitude: location.lat, longitude: location.long }
          } else {
            const customerId = socket.customerId
            const restaurantId = socket.restaurantId

            if (customerId === undefined || restaurantId === undefined) {
              const [assigned, order] = await isPartnerAssigned(socket.partnerId)
              socket.restaurantId = order.restaurant_id
              socket.customerId = order.customer_id
            }

            socket.to(customerMap[customerId]).emit('partnerLocationUpdate', location)
            socket.to(restaurantMap[restaurantId]).emit('partnerLocationUpdate', location)
          }
        } catch (err) {
          // if restaurant copy pastes http://localhost:3001/delivery_partner-Home url then order is null in above
        }
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

// console.log('assignedPartnerMap:', assignedPartnerMap)
// console.log('unassignedPartnerMap:', unassignedPartnerMap)
