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
  const res = await pool.query('SELECT * FROM restaurant')
  return res.rows
}

export async function getRestaurantMenu(restaurant_id) {
  const res = await pool.query('SELECT * FROM food_item  WHERE restaurant_id = $1;', [
    restaurant_id
  ])
  return res.rows
}

export async function getItemPrices(itemIds, restaurantId) {
  const res = await pool.query(
    `SELECT item_id, price
     FROM food_item
     WHERE item_id = ANY($1) AND restaurant_id = $2`,
    [itemIds, restaurantId]
  )
  return res.rows
}

export async function placeOrder(restaurantId, totalAmount, orderItems, orderTime, customerId) {
  const query = `INSERT INTO orders(order_time, total_price, customer_id, restaurant_id, order_items) 
                 values (to_timestamp($1/1000.0), $2, $3 , $4, $5);`
  const params = [orderTime, totalAmount, customerId, restaurantId, orderItems]
  await pool.query(query, params)
}

// res_id or agent_id is undefined or null,
// case

// err cases:
// getRestaruants: query syntax err, db down
// getRestaurantMenu: unknown res_id or res_id with no items (returns items [])
// case clientCart total !== dbcart total
