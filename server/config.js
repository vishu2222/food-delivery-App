import dotenv from 'dotenv'

dotenv.config()
const port = process.env.PORT
const DB_CONN_STRING = process.env.DB_CONN_STRING
const MAP_KEY = process.env.MAP_KEY

export default { port, DB_CONN_STRING, MAP_KEY }
