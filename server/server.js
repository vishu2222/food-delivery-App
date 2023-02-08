import express from 'express'
import cors from 'cors'
// import { router as restaurantRouter } from './routes/restaurantRoute.js'
// import { router as orderRouter } from './routes/ordersRoute.js'
import { router as customerRouter } from './routes/customersRoute.js'
import { router as userRouter } from './routes/userRoute.js'
import config from './config.js'
import { createServer } from 'http'
import socketSetup from './sockets/sockets.js'

const port = config.port
const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app)
socketSetup.init(httpServer)

app.use('/', customerRouter)
app.use('/users', userRouter)
// app.use('/restaurants', restaurantRouter)
// app.use('/orders', orderRouter)

httpServer.listen(port, () => {
  console.log('server listening on port:', port)
})
