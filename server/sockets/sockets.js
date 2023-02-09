import { Server } from 'socket.io'

let io
export default {
  init: (httpServer) => {
    io = new Server(httpServer, { cors: { origin: ['*'] } })
    let count = 0
    io.on('connection', (socket) => {
      count++
      console.log('socket count', count)

      socket.on('disconnect', () => {
        count--
        console.log('socket count', count)
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
