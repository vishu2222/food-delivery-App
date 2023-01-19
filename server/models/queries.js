import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const { Pool } = pg
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

async function runQuery(query, params) {
  const client = await pool.connect()
  const res = await client.query(query, params)
  client.release()
  return res
}

export async function getRestaruants() {
  try {
    const query = `select * from restaurants;`
    const params = []
    const res = await runQuery(query, params)
    return res.rows
  } catch (err) {
    return 'internal error'
  }
}

export async function getRestaurantMenu(restaurant_id) {
  try {
    const query = `select * from items where restaurant_id = $1;`
    const params = [restaurant_id]
    const res = await runQuery(query, params)
    return res.rows
  } catch (err) {
    return 'internal error'
  }
}
