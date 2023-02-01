import { Server } from 'socket.io'

let io
export default {
  init: (httpServer) => {
    io = new Server(httpServer, { cors: { origin: ['*'] } })
    // registering socket listeners
    let resCount = 0
    io.on('connection', (socket) => {
      resCount++
      console.log('sockets, count', resCount)

      socket.on('disconnect', () => {
        resCount--
        console.log('sockets count ', resCount)
      })
    })
    // return io
  },
  get: () => {
    if (io) {
      return io
    }
    throw new Error('socket not initialized')
  }
}
