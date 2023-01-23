import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') }) //

const { Pool } = pg
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})

export async function getRestaruants() {
  // handle errors //
  const res = await pool.query('select * from restaurants')
  return res.rows
}

export async function getRestaurantMenu(restaurant_id) {
  // case wrong table name, // id not exists
  const res = await pool.query('select * from menus where restaurant_id = $1;', [restaurant_id])
  return res.rows
}
