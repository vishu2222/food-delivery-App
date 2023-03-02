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

export async function getRestaruants() {
  const res = await pool.query(`SELECT restaurant_id, restaurant_name, start_time, close_time, img 
                      FROM restaurant`)
  return res.rows
}

export async function getMenu(restaurantId) {
  const res = await pool.query(
    'SELECT item_id, item_name, price, description, category, availability, img FROM food_item  WHERE restaurant_id = $1;',
    [restaurantId]
  )
  return res.rows
}

export async function getRestaruant(restaurantId) {
  const res = await pool.query(
    'SELECT restaurant_id, restaurant_name, phone, lat,long, address, city, start_time, close_time, img FROM restaurant WHERE restaurant_id=$1;',
    [restaurantId]
  )
  return res.rows
}
