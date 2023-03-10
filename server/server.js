import express from 'express'
import cors from 'cors'
import config from './config.js'
import cookieParser from 'cookie-parser'
// import { createServer } from 'https'
import { createServer } from 'http'
// import fs from 'fs'
import socketSetup from './sockets.js'
import { router as restaurantRouter } from './routes/restaurants.js'
import { router as ordersRouter } from './routes/orders.js'
import { router as usersRouter } from './routes/users.js'
import { router as sessionRouter } from './routes/session.js'
import { router as addressRouter } from './routes/customer.js'
import { routeTypeDetector } from './middleware/routeTypeDetector.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

const port = config.port

const app = express()

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:8080'], credentials: true }))
app.use(express.json())
app.use(cookieParser())

// const httpsOptions = {
//   key: fs.readFileSync('./server.key'),
//   cert: fs.readFileSync('./server.crt')
// }

// const httpServer = createServer(httpsOptions, app)

const httpServer = createServer(app)
socketSetup.init(httpServer)

const filePath = dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.join(filePath, 'build')))

app.use(routeTypeDetector(filePath))
app.use('/api/restaurants', restaurantRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/users', usersRouter)
app.use('/api/sessions', sessionRouter)
app.use('/api/customers', addressRouter)

httpServer.listen(port, '0.0.0.0', (err) => {
  if (err) console.log(err)
  console.log('server listening on port:', port)
})
