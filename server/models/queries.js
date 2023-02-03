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
  const res = await pool.query('SELECT * FROM food_item  WHERE restaurant_id = $1;', [restaurant_id])
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

export async function getOrderId(customerId, restaurantId) {
  const query = `SELECT order_id
                 FROM orders 
                 WHERE customer_id = $1
                 AND restaurant_id=$2 
                 AND created_at = 
                 (SELECT MAX(created_at) FROM orders WHERE  customer_id = $1 AND restaurant_id = $2)`
  const params = [customerId, restaurantId]
  const response = await pool.query(query, params)

  if (response.rowCount < 1) throw new Error('could not find the order')
  return response.rows[0].order_id
}

export async function placeOrder(restaurantId, addressId, totalAmount, orderItems, orderTime, customerId) {
  const query = `INSERT INTO orders(order_time, total_price, customer_id, address_id, restaurant_id, order_items) 
                 values (to_timestamp($1/1000.0), $2, $3 , $4, $5, $6);`
  const params = [orderTime, totalAmount, customerId, addressId, restaurantId, orderItems]
  const response = await pool.query(query, params)
  if (response.rowCount < 1) throw new Error('db err: cannot insert order')
}

export async function addRestaurantConfirmation(orderId) {
  const query = `UPDATE orders 
                 SET restaurant_confirmed = true
                 WHERE order_id = $1`
  const params = [orderId]
  const res = await pool.query(query, params)
  if (res.rowCount < 1) throw new Error('db err: cannot insert into orders')
}

export async function getRestaruantsAddress(orderId) {
  const query = `SELECT restaurant_name, phone, lat,long,address,city FROM orders o INNER JOIN restaurant r
                 ON o.restaurant_id = r.restaurant_id 
                 WHERE order_id=$1;`
  const params = [orderId]
  const res = await pool.query(query, params)
  if (res.rowCount < 1) throw new Error('db err: cannot find resstaurant address')
  return res.rows[0]
}

export async function getCustomersAddress(orderId) {
  const query = `SELECT c.phone, ca.lat, ca.long, ca.house_no, ca.locality, ca.city
                 FROM orders o
                 INNER JOIN customer_address ca
                 ON o.address_id = ca.address_id
                 INNER JOIN customer c
                 ON c.customer_id = o.customer_id
                 WHERE o.order_id = $1;`
  const params = [orderId]
  const res = await pool.query(query, params)
  if (res.rowCount < 1) throw new Error('db err: unable to get customer address')
  return res.rows[0]
}

export async function getDelivaryPartnerDetails(partnerId) {
  const query = `select partner_name, phone from delivary_partner where partner_id = $1;`
  const params = [partnerId]
  const res = await pool.query(query, params)
  if (res.rowCount < 1) throw new Error('db err: unable to get dp details')
  return res.rows[0]
}

export async function addDelivaryPartner(orderId, partnerId) {
  const query = `UPDATE orders SET partner_id = ($1) where order_id=$2;`
  const params = [partnerId, orderId]
  const res = await pool.query(query, params)
  if (res.rowCount < 1) throw new Error('db err: unable to update delivary partner')
}

//-------------------------------------------------------------------------
// res_id or agent_id is undefined or null,
// case

// err cases:
// getRestaruants: query syntax err, db down
// getRestaurantMenu: unknown res_id or res_id with no items (returns items [])
// case clientCart total !== dbcart total
