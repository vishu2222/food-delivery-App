import pg from 'pg'
import config from '../config.js'

const { Pool } = pg
const pool = new Pool({
  connectionString: config.DB_CONN_STRING,
  ssl: {
    rejectUnauthorized: false
  }
})

export async function getOrder(orderId) {
  const query = `select * from orders where order_id=$1`
  const params = [orderId]
  const res = await pool.query(query, params)
  if (res.rowCount < 1) throw new Error('orderNotFound')
  return res.rows[0]
}

export async function isPartnerAssigned(partnerId) {
  const query = `select order_id, customer_id, address_id, restaurant_id, partner_id 
                 from orders 
                 where partner_id=$1 and status in ('awaiting pickup', 'awaiting delivery');`
  const params = [partnerId]
  const res = await pool.query(query, params)
  if (res.rowCount < 1) return [false, null]
  return [true, res.rows[0]]
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

export async function getItemPrices(itemIds, restaurantId) {
  const query = `SELECT item_id, price
                 FROM food_item
                 WHERE item_id = ANY($1) AND restaurant_id = $2`
  const res = await pool.query(query, [itemIds, restaurantId])
  return res.rows
}

export async function placeOrder(restaurantId, addressId, totalAmount, orderItems, orderTime, customerId) {
  const orderStatus = 'awaiting restaurant confirmation'
  const query = `INSERT INTO orders(order_time, total_price, customer_id, address_id, restaurant_id, order_items, status) 
                 values (to_timestamp($1/1000.0), $2, $3 , $4, $5, $6, $7);`
  const params = [orderTime, totalAmount, customerId, addressId, restaurantId, orderItems, orderStatus]
  const response = await pool.query(query, params)
  if (response.rowCount < 1) throw new Error('db err: cannot insert order')
}

export async function getAllCustomerOrders(customerId) {
  const query = `SELECT order_id, status FROM orders WHERE customer_id = $1 order by order_time desc;;`
  const params = [customerId]
  const res = await pool.query(query, params)
  return res.rows
}

export async function getAllRestaurantOrders(restaurantId) {
  const query = `SELECT order_id, order_time, order_items, total_price, status 
                 from orders 
                 where restaurant_id = $1
                 order by order_time desc;`
  const params = [restaurantId]
  const res = await pool.query(query, params)
  return res.rows
}

export async function getAllPartnersOrders(partnerId) {
  const query = `SELECT order_id, order_time, total_price, status, restaurant_name,
                 phone, lat, long, address, start_time, close_time
                 from orders 
                 inner join restaurant restaurant
                 on orders.restaurant_id = restaurant.restaurant_id
                 where partner_id = $1
                 order by order_time desc;`
  const params = [partnerId]
  const res = await pool.query(query, params)
  return res.rows
}

export async function fetchOrderDetails(orderId) {
  const query = `SELECT order_id, order_items, order_time, delivery_time, total_price, 
                 restaurant_name, status, partner_name, delivery_partner.phone
                 FROM orders
                 INNER JOIN restaurant
                 ON orders.restaurant_id = restaurant.restaurant_id
                 LEFT JOIN delivery_partner
                 ON orders.partner_id = delivery_partner.partner_id
                 WHERE order_id = $1 ;`
  const res = await pool.query(query, [orderId])
  return res.rows
}
//

export async function updateRestaurantConfirmation(orderId, statusUpdate) {
  const query = `UPDATE orders
                 SET status = $2
                 WHERE order_id = $1`
  const params = [orderId, statusUpdate]
  const res = await pool.query(query, params)
  if (res.rowCount < 1) throw new Error('orderNotFound')
}

export async function getItemNames(itemIds) {
  const query = `SELECT item_id, item_name FROM food_item WHERE item_id = ANY($1)`
  const res = await pool.query(query, [itemIds])
  return res.rows
}

export async function getRestaurantDetails(restaurantId) {
  const query = `SELECT restaurant_name, phone, lat, long, address, city, close_time
                 FROM restaurant
                 WHERE restaurant_id=$1;`
  const params = [restaurantId]
  const res = await pool.query(query, params)
  return res.rows
}

export async function assignPartner(orderId, partnerId) {
  const query = `UPDATE orders 
                 SET partner_id = $1, status ='awaiting pickup'
                 WHERE order_id = $2;`
  const params = [partnerId, orderId]
  const res = await pool.query(query, params)
  if (res.rowCount < 1) throw new Error('db failed to update order')
}

export async function updatePickup(orderId) {
  const query = `UPDATE orders
                 SET status = 'awaiting delivery'
                 WHERE order_id = $1;`
  const params = [orderId]
  const res = await pool.query(query, params)
  if (res.rowCount < 1) return new Error('orderNotFound')
}

export async function updateDelivery(orderId, status) {
  const query = `UPDATE orders
                 SET status = $2
                 WHERE order_id = $1;`
  const params = [orderId, status]
  const res = await pool.query(query, params)
  if (res.rowCount < 1) return new Error('orderNotFound')
}

export async function getOrderAmount(orderId) {
  const query = `select total_price from orders where order_id=$1`
  const params = [orderId]
  const res = await pool.query(query, params)
  return res.rows[0].total_price // can throw error if orderId is invalid
}

export async function getCustomerId(orderId) {
  const query = `select customer_id from orders where order_id=$1`
  const params = [orderId]

  const res = await pool.query(query, params)
  if (res.rowCount < 1) throw new Error('orderNotFound')
  return res.rows[0].customer_id
}

export async function cancellOrder(orderId) {
  const query = `UPDATE orders SET status = 'cancelled' WHERE order_id = $1;`
  const params = [orderId]

  const res = await pool.query(query, params)
}

// export async function updateDeliveryConfirmation(orderId, statusUpdate) {
//   const query = `UPDATE orders
//                  SET status = $2
//                  WHERE order_id = $1`
//   const params = [orderId, statusUpdate]
//   const res = await pool.query(query, params)
//   if (res.rowCount < 1) throw new Error('db err: cannot update the order')
// }

// const test = pool.query('select * from ')
