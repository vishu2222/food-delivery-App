import express from 'express'
import cors from 'cors'
import config from './config.js'
import { createServer } from 'http'
import socketSetup from './sockets/sockets.js'
import { router as restaurantRouter } from './routes/restaurants.js'
import { router as ordersRouter } from './routes/orders.js'

const port = config.port
const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app)
socketSetup.init(httpServer)

app.use('/restaurants', restaurantRouter)
app.use('/orders', ordersRouter)

httpServer.listen(port, () => {
  console.log('server listening on port:', port)
})
