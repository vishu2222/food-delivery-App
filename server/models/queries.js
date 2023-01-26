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
  const res = await pool.query('select * from restaurants')
  return res.rows
}

export async function getRestaurantMenu(restaurant_id) {
  const res = await pool.query('select * from foodItems where restaurant_id = $1;', [restaurant_id])
  return res.rows
}

async function getTotalPrice(clientCart, client) {
  let totalPrice = 0
  const itemIds = clientCart.map((item) => item.item_id)
  const result = await client.query(
    'select item_id, price from foodItems where item_id = ANY($1::int[])',
    [itemIds]
  )
  const dbCart = result.rows
  dbCart.forEach((item) => {
    const price = item.price
    const quantity = clientCart.find((i) => i.item_id === item.item_id).count
    totalPrice += price * quantity
  })
  return totalPrice
}

export async function getOrderId(orderTime, client) {
  const response = await client.query(
    `select * from orders where order_time =  to_timestamp($1/1000.0)`,
    [orderTime]
  )
  return response.rows[0].order_id
}

export async function placeOrder(order) {
  const orderTime = Date.now()
  const paymentDone = 'true'
  const delivaryStatus = 'pending'
  const restaurantId = order[0].restaurant_id
  const agentId = 1
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const totalPrice = await getTotalPrice(order, client)

    const query = `insert into orders(order_time, total_price, payment_done, delivary_status, restaurant_id, agent_id) 
                   values ( to_timestamp($1/1000.0), $2, $3, $4, $5, $6)`
    const params = [orderTime, totalPrice, paymentDone, delivaryStatus, restaurantId, agentId]

    await client.query(query, params)
    const orderId = await getOrderId(orderTime, client)

    for (let item of order) {
      const itemId = item.item_id
      const quantity = item.count
      const query = `insert into order_items(order_id, item_id, quantity) values ($1, $2, $3)`
      const params = [orderId, itemId, quantity]
      await client.query(query, params)
    }

    // await client.query('invalid query')
    await client.query('COMMIT')
    return 'orderPlaced'
  } catch (err) {
    client.query('ROLLBACK')
    throw new Error('orderFailed')
  } finally {
    client.release()
  }
}

// case res_id not same for items,
// res_id or agent_id is undefined or null,
// case

// err cases:
// getRestaruants: query syntax err, db down
// getRestaurantMenu: unknown res_id or res_id with no items (returns items [])
// case clientCart total !== dbcart total
