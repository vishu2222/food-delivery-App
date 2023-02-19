import { Server } from 'socket.io'
import { socketMap } from './models/socketMap.js'

let io
let count = 0
export default {
  init: (httpServer) => {
    io = new Server(httpServer, { cors: { origin: ['http://localhost:3001'] }, cookie: true, httpOnly: true })

    io.use((socket, next) => {
      socket.sessionId = socket.handshake.headers.cookie.split('sessionId=')[1]
      socketMap[socket.sessionId] = socket.id
      next()
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
