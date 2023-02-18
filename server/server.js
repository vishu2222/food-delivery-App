import express from 'express'
import cors from 'cors'
import config from './config.js'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import socketSetup from './models/partnerLocations.js'
import { router as restaurantRouter } from './routes/restaurants.js'
import { router as ordersRouter } from './routes/orders.js'
import { router as usersRouter } from './routes/users.js'
import { router as sessionRouter } from './routes/session.js'
import { router as addressRouter } from './routes/customer.js'

const port = config.port
const app = express()

app.use(cors({ origin: 'http://localhost:3001', credentials: true }))
app.use(express.json())
app.use(cookieParser())

const httpServer = createServer(app)
socketSetup.init(httpServer)

app.use('/restaurants', restaurantRouter)
app.use('/orders', ordersRouter)
app.use('/users', usersRouter)
app.use('/sessions', sessionRouter)
app.use('/customers', addressRouter)

httpServer.listen(port, () => {
  console.log('server listening on port:', port)
})
