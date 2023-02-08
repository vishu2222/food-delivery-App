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
  const res = await pool.query(`SELECT restaurant_id, restaurant_name, phone, address, city, start_time, close_time, img 
                                FROM restaurant`)
  return res.rows
}

export async function getMenu(restaurantId) {
  const res = await pool.query('SELECT * FROM food_item  WHERE restaurant_id = $1;', [restaurantId])
  return res.rows
}

export async function getRestaruant(restaurantId) {
  const res = await pool.query('SELECT * FROM restaurant WHERE restaurant_id=$1;', [restaurantId])
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

export async function getAddress(addressId) {
  const res = await pool.query(`SELECT * FROM customer_address WHERE address_id=$1`, [addressId])
  return res.rows
}

export async function placeOrder(restaurantId, addressId, totalAmount, orderItems, orderTime, customerId) {
  const query = `INSERT INTO orders(order_time, total_price, customer_id, address_id, restaurant_id, order_items) 
                 values (to_timestamp($1/1000.0), $2, $3 , $4, $5, $6);`
  const params = [orderTime, totalAmount, customerId, addressId, restaurantId, orderItems]
  const response = await pool.query(query, params)
  if (response.rowCount < 1) throw new Error('db err: cannot insert order')
}

export async function getOrderId(customerId, restaurantId) {
  const query = `SELECT order_id
                 FROM orders 
                 WHERE customer_id = $1
                 AND restaurant_id=$2 
                 AND created_at = 
                 (SELECT MAX(created_at) FROM orders WHERE  customer_id = $1 AND restaurant_id = $2);`
  const params = [customerId, restaurantId]
  const response = await pool.query(query, params)

  if (response.rowCount < 1) throw new Error('could not find the order')
  return response.rows[0].order_id
}

export async function fetchOrderDetails(orderId, customerId) {
  const query = `SELECT order_id, order_items, order_time, delivary_time,total_price,restaurant_confirmed,
                 partner_assigned, order_pickedup, delivary_status, address_id, restaurant_id, partner_id
                 FROM orders WHERE order_id=$1 AND customer_id=$2`
  const res = await pool.query(query, [orderId, customerId])
  return res.rows
}

export async function getDelivaryPartner(partnerId) {
  const query = `SELECT * FROM delivary_partner WHERE partner_id = $1`
  const params = [partnerId]
  const res = await pool.query(query, params)
  return res.rows
}

export async function getItemNames(itemIds) {
  const query = `SELECT item_id, item_name FROM food_item WHERE item_id = ANY($1)`
  const res = await pool.query(query, [itemIds])
  return res.rows
}

export async function getRestaruantName(restaurantId) {
  const query = 'SELECT restaurant_name FROM restaurant WHERE restaurant_id=$1;'
  const params = [restaurantId]
  const res = await pool.query(query, params)
  return res.rows
}

export async function getOrders(customerId) {
  const query = `SELECT order_id, delivary_status FROM orders WHERE customer_id = $1;`
  const params = [customerId]
  const res = await pool.query(query, params)
  return res.rows
}
