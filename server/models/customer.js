import pg from 'pg'
import config from '../config.js'

const { Pool } = pg

const pool = new Pool({
  connectionString: config.DB_CONN_STRING,
  ssl: {
    rejectUnauthorized: false
  }
})

export async function addAddress(address, customerId) {
  const params = [
    address.lat,
    address.long,
    address.house_no,
    address.locality,
    address.city,
    address.state,
    address.pincode,
    customerId
  ]
  console.log('params', params)
  const res = await pool.query(
    `insert into customer_address
     (lat, long, house_no, locality, city, state, pincode, customer_id)
     values ($1, $2, $3, $4, $5, $6, $7, $8)`,
    params
  )
}

export async function getAddress(customerId) {
  const res = await pool.query(`select * from customer_address where customer_id=$1`, [customerId])
  return res.rows
}
