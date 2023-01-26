import dotenv from 'dotenv'

dotenv.config()
const port = process.env.PORT
const dbUser = process.env.DB_USER
const dbHost = process.env.DB_HOST
const dbName = process.env.DB_DATABASE
const dbPwd = process.env.DB_PASSWORD
const dbPort = process.env.DB_PORT
const clientUrl = process.env.CLIENT_URL

export default { port, dbUser, dbHost, dbName, dbPwd, dbPort, clientUrl }
