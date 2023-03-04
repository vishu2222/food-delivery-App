import express from 'express'
import cors from 'cors'
import config from './config.js'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import socketSetup from './sockets.js'
import { router as restaurantRouter } from './routes/restaurants.js'
import { router as ordersRouter } from './routes/orders.js'
import { router as usersRouter } from './routes/users.js'
import { router as sessionRouter } from './routes/session.js'
import { router as addressRouter } from './routes/customer.js'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const port = config.port
const app = express()

app.use(cors({ origin: ['http://localhost:3001', 'http://localhost:3000'], credentials: true }))
app.use(express.json())
app.use(cookieParser())

const httpServer = createServer(app)
socketSetup.init(httpServer)

const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.join(__dirname, 'build')))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
  // res.sendFile(path.join(process.cwd(), 'build', 'index.html'))
})

app.use('/restaurants', restaurantRouter)
app.use('/orders', ordersRouter)
app.use('/users', usersRouter)
app.use('/sessions', sessionRouter)
app.use('/customers', addressRouter)

httpServer.listen(port, () => {
  console.log('server listening on port:', port)
})
