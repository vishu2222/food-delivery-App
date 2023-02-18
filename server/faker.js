import { faker } from '@faker-js/faker'
import pg from 'pg'
import config from './config.js'
import bcrypt from 'bcrypt'

const { Pool } = pg
const pool = new Pool({
  user: config.dbUser,
  host: config.dbHost,
  database: config.dbName,
  password: config.dbPwd,
  port: config.dbPort
})

const numRestaurants = 2
const numItems = 2
const salt = await bcrypt.genSalt()

async function insertRestaurantUsers() {
  for (let i = 1; i <= numRestaurants; i++) {
    const user_name = `restaurant${i}`
    const user_type = `restaurant`
    const password = await bcrypt.hash(`restaurant${i}`, salt)
    const restaurant_name = user_name
    const phone = String(2222222222 + i)
    const lat = 12.97202 + Math.random() / 100.0
    const long = 77.59025 + Math.random() / 100.0
    const address = `address${i}`
    const city = `city${i}`
    const start_time = '10:05 AM'
    const close_time = '11:00 PM'
    const img = faker.image.imageUrl(300, 300, 'food', true)

    const client = await pool.connect()
    client.query('BEGIN')

    // inserting into users Table for restaurant users
    client.query(`insert into users(user_name, user_type, password) values( $1, $2, $3)`, [
      user_name,
      user_type,
      password
    ])

    const response = await client.query(`SELECT user_id  FROM users WHERE user_name= $1`, [user_name])
    const userId = response.rows[0].user_id

    // inserting into restaurant table
    const params = [restaurant_name, phone, lat, long, city, start_time, close_time, userId, address, img]
    await client.query(
      `INSERT INTO restaurant(restaurant_name, phone, lat, long, city, start_time, close_time, user_id, address, img)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
      params
    )

    // inserting into food_items Table
    for (let item = 1; item <= numItems; item++) {
      const itemName = `item${item}`
      const itemPrice = Math.round(Math.random() * 100)
      const itemImg = faker.image.imageUrl(150, 150, 'food', true)

      const response = await client.query(`select restaurant_id from restaurant where restaurant_name=$1`, [
        restaurant_name
      ])
      const resId = response.rows[0].restaurant_id

      const query = `insert into food_item(item_name, price, restaurant_id, img) values($1, $2, $3, $4)`
      const params = [itemName, itemPrice, resId, itemImg]
      await client.query(query, params)
    }

    await client.query('COMMIT')
    client.release()
  }
}

await insertRestaurantUsers()

async function insertACustomer() {
  const userName = `customer1`
  const userType = `customer`
  const password = await bcrypt.hash(`customer1`, salt)
  const customerName = 'customer1'
  const phone = 9999999999
  const email = 'customer1@email'

  const client = await pool.connect()
  await client.query('BEGIN')

  await client.query(
    `INSERT INTO users(user_name, user_type, password)
       VALUES ($1, $2, $3);`,
    [userName, userType, password]
  )

  const response = await client.query(`SELECT user_id 
                                         FROM users  
                                         WHERE created_at = (SELECT MAX(created_at) FROM users);`)

  const params = [customerName, phone, email, response.rows[0].user_id]
  await client.query(`INSERT INTO customer(customer_name, phone, email, user_id) VALUES ($1, $2, $3, $4);`, params)

  const res = await client.query(`select * from customer where customer_name='customer1';`)
  const customerId = res.rows[0].customer_id

  await client.query(`insert into customer_address(lat, long, house_no, locality, city, customer_id)
                      values(12.972442, 77.580643, 'H.No:1', 'locationA', 'Bangalore',${customerId})`)

  await client.query('COMMIT')
  client.release()
}

await insertACustomer()

async function insertAPartner() {
  const userName = `partner1`
  const userType = `delivery_partner`
  const password = await bcrypt.hash(`partner1`, salt)
  const partner_name = 'partner1'
  const phone = 8888888888

  const client = await pool.connect()
  await client.query('BEGIN')

  await client.query(
    `INSERT INTO users(user_name, user_type, password)
       VALUES ($1, $2, $3);`,
    [userName, userType, password]
  )

  const response = await client.query(`SELECT user_id
                                         FROM users
                                         WHERE created_at = (SELECT MAX(created_at) FROM users);`)

  const params = [partner_name, phone, response.rows[0].user_id]
  await client.query(`INSERT INTO delivery_partner(partner_name, phone, user_id) VALUES ($1, $2, $3);`, params)

  await client.query('COMMIT')
  client.release()
}

await insertAPartner()
