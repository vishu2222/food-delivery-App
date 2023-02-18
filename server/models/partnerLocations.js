import { Server } from 'socket.io'

let io
let count = 0
export default {
  init: (httpServer) => {
    io = new Server(httpServer, { cors: { origin: ['*'] } })

    io.on('connection', (socket) => {
      count++
      console.log('socket count', count)
      console.log('socketId', socket.id)

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
