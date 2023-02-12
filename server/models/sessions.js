import pg from 'pg'
import config from '../config.js'

const { Pool } = pg
const pool = new Pool({
  user: config.dbUser,
  host: config.dbHost,
  database: config.dbName,
  password: config.dbPwd,
  port: config.dbPort
})

export async function getUserCredentials(userName) {
  const query = 'SELECT * FROM users where user_name = $1'
  const params = [userName]
  const res = await pool.query(query, params)
  return res.rows
}
