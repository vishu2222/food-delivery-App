import express from 'express'
import cors from 'cors'
import { router as restaurantRouter } from './routes/restaurantRoute.js'
import { router as orderRouter } from './routes/ordersRoute.js'
import config from './config.js'

const port = config.port
const app = express()
app.use(cors())
app.use(express.json())

app.use('/restaurants', restaurantRouter)
app.use('/orders', orderRouter)

app.listen(port, () => {
  console.log('server listening on port:', port)
})
