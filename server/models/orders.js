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

export async function getItemPrices(itemIds, restaurantId) {
  const query = `SELECT item_id, price
                 FROM food_item
                 WHERE item_id = ANY($1) AND restaurant_id = $2`
  const res = await pool.query(query, [itemIds, restaurantId])
  return res.rows
}

export async function placeOrder(restaurantId, addressId, totalAmount, orderItems, orderTime, customerId) {
  const query = `INSERT INTO orders(order_time, total_price, customer_id, address_id, restaurant_id, order_items) 
                 values (to_timestamp($1/1000.0), $2, $3 , $4, $5, $6);`
  const params = [orderTime, totalAmount, customerId, addressId, restaurantId, orderItems]
  const response = await pool.query(query, params)
  if (response.rowCount < 1) throw new Error('db err: cannot insert order')
}

export async function getAllCustomerOrders(customerId) {
  const query = `SELECT order_id, order_status FROM orders WHERE customer_id = $1;`
  const params = [customerId]
  const res = await pool.query(query, params)
  return res.rows
}

export async function getAllRestaurantOrders(restaurantId) {
  const query = `SELECT order_id, order_time, total_price, order_status from orders where restaurant_id = $1;`
  const params = [restaurantId]
  const res = await pool.query(query, params)
  return res.rows
}

export async function getOrderStatus(orderId, customerId) {
  const query = `SELECT order_status FROM orders WHERE order_id = $1 AND customer_id = $2;`
  const params = [orderId, customerId]
  const res = await pool.query(query, params)
  return res.rows
}

export async function fetchOrderDetails(orderId) {
  const query = `SELECT order_id, order_items, order_time, delivary_time, 
                 total_price, restaurant_name, order_status
                 FROM orders 
                 INNER JOIN restaurant
                 ON orders.restaurant_id = restaurant.restaurant_id
                 WHERE order_id=$1;`
  const res = await pool.query(query, [orderId])
  return res.rows
}

export async function fetchDeliveryDetails(orderId) {
  const query = `SELECT order_id, order_items, order_time, delivary_time, total_price, 
                   restaurant_name, order_status, partner_name, delivary_partner.phone
                 FROM orders
                 INNER JOIN restaurant
                 ON orders.restaurant_id = restaurant.restaurant_id
                 INNER JOIN delivary_partner
                 ON orders.partner_id = delivary_partner.partner_id
                 WHERE order_id = $1 ;`
  const res = await pool.query(query, [orderId])
  return res.rows
}

export async function updateRestaurantConfirmation(orderId, statusUpdate) {
  const query = `UPDATE orders
                 SET order_status = $2
                 WHERE order_id = $1`
  const params = [orderId, statusUpdate]
  const res = await pool.query(query, params)
  return res.rowCount
}

// export async function updateDelivaryConfirmation(orderId, statusUpdate) {
//   const query = `UPDATE orders
//                  SET order_status = $2
//                  WHERE order_id = $1`
//   const params = [orderId, statusUpdate]
//   const res = await pool.query(query, params)
//   if (res.rowCount < 1) throw new Error('db err: cannot update the order')
// }

export async function getItemNames(itemIds) {
  const query = `SELECT item_id, item_name FROM food_item WHERE item_id = ANY($1)`
  const res = await pool.query(query, [itemIds])
  return res.rows
}

export async function getRestaurantsLocation(restaurantId) {
  const query = `SELECT restaurant_name, phone, lat,long,address,city 
                   FROM restaurant
                   WHERE restaurant_id=$1;`
  const params = [restaurantId]
  const res = await pool.query(query, params)
  return res.rows
}

export async function setDelivaryPartner(orderId, partnerId) {
  const query = `UPDATE orders 
                 SET partner_id = $1, order_status ='awaiting pickup'
                 WHERE order_id = $2;`
  const params = [partnerId, orderId]
  const res = await pool.query(query, params)
  if (res.rowCount < 1) throw new Error('db failed to update order')
}

export async function updatePickup(orderId) {
  const query = `UPDATE orders
                 SET order_status = 'awaiting delivary'
                 WHERE order_id = $1;`
  const params = [orderId]
  const res = await pool.query(query, params)
  return res.rowCount
}

export async function updateDelivary(orderId) {
  const query = `UPDATE orders
                 SET order_status = 'delivered'
                 WHERE order_id = $1;`
  const params = [orderId]
  const res = await pool.query(query, params)
  return res.rowCount
}
