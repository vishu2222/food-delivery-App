import pg from 'pg'
import config from '../config.js'

const { Pool } = pg
const pool = new Pool({
  connectionString: config.DB_CONN_STRING,
  ssl: {
    rejectUnauthorized: false
  }
})

export async function registerCustomer(userName, userType, password, customerName, phone, email) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    await client.query(
      `INSERT INTO users(user_name, user_type, password)
       VALUES ($1, $2, $3);`,
      [userName, userType, password]
    )

    const response = await client.query(`SELECT user_id 
                                         FROM users  
                                         WHERE created_at = (SELECT MAX(created_at) FROM users);`)
    // can use user_name instead of subquery

    const params = [customerName, phone, email, response.rows[0].user_id]
    await client.query(`INSERT INTO customer(customer_name, phone, email, user_id) VALUES ($1, $2, $3, $4);`, params)

    await client.query('COMMIT')
  } catch (err) {
    client.query('ROLLBACK')

    if (err.code === '23505' && err.table === 'users') throw new Error('userExists')
    if (err.code === '23505' && err.table === 'customer') throw new Error('phoneExists')

    throw new Error('db error cannot register user')
  } finally {
    client.release()
  }
}

export async function registerRestaurant() {}

export async function registerDeliveryPartner() {}
