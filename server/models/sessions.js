import pg from 'pg'
import config from '../config.js'

const { Pool } = pg
const pool = new Pool({
  connectionString: config.DB_CONN_STRING,
  ssl: {
    rejectUnauthorized: false
  }
})

export async function getUserDetails(userName) {
  const query = `SELECT users.user_id, user_name, user_type, password
                 FROM users 
                 LEFT JOIN customer ON users.user_id = customer.user_id
                 LEFT JOIN restaurant ON restaurant.user_id = users.user_id
                 LEFT JOIN delivery_partner ON delivery_partner.user_id = users.user_id
                 WHERE user_name = $1;`

  const res = await pool.query(query, [userName])

  if (res.rowCount < 1) throw new Error('invalidUserName')
  return res.rows[0]
}

export async function createSession(sessionId, userId) {
  const query = `insert into sessions(session_id, user_id) values ($1, $2);`
  const params = [sessionId, userId]
  const res = await pool.query(query, params)
  if (res.rowCount < 1) throw new Error('insertFailed')
}

export async function deleteSession(sessionId) {
  const query = `delete from sessions where session_id = &1;`
  await pool.query(query, [sessionId])
}

export async function getSessionUserDetails(sessionId) {
  //  need to refactor the query to reduce multiple joins
  const query = `with cte as 
                         (
	                        select s.session_id, s.user_id, s.created_at, u.user_name, u.user_type from sessions s
                          inner join users u on s.user_id = u.user_id 
                          where s.session_id = $1
                         )
                 select cte.session_id, cte.user_id, cte.created_at, cte.user_name, cte.user_type, customer_id, restaurant_id, partner_id
                 from cte
                 left join customer on customer.user_id = cte.user_id
                 left join restaurant on restaurant.user_id = cte.user_id
                 left join delivery_partner on delivery_partner.user_id = cte.user_id;`
  const params = [sessionId]
  const res = await pool.query(query, params)

  if (res.rowCount < 1) throw new Error('sessionDoesntExist')
  return res.rows[0]
}
