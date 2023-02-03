import { Server } from 'socket.io'

export const partners = []

export const getPartnersLoc = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(partners)
    }, 3000)
  })
}

let io
export default {
  init: (httpServer) => {
    io = new Server(httpServer, { cors: { origin: ['*'] } })
    let count = 0
    io.on('connection', (socket) => {
      count++
      console.log('socket count', count)

      socket.on('my-location', (msg) => {
        partners.push(msg)
      })

      socket.on('my-live-location', (msg) => {
        console.log(msg)
      })
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
