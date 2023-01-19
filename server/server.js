import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { router as restaurantRouter } from './routes/restaurantRoute.js'

dotenv.config()
const port = process.env.PORT
const app = express()
app.use(cors({ origin: process.env.URL }))
app.use(express.json())

app.use('/restaurants', restaurantRouter)

app.listen(port, () => {
  console.log('server listening on port:', port)
})
