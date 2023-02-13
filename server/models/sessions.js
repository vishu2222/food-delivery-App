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

export async function getUserDetails(userName, userType) {
  const query = `select * from users
                 inner join ${userType} 
                 on users.user_id = customer.user_id 
                 where user_name = $1;`

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

export async function getSessionUserDetails(sessionId) {
  //   const query = `select * from sessions where session_id = $1`
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
                 left join delivary_partner on delivary_partner.user_id = cte.user_id;`
  const params = [sessionId]
  const res = await pool.query(query, params)

  if (res.rowCount < 1) throw new Error('sessionDoesntExist')
  return res.rows[0]
}

// console.log(await getSessionUser('e5ac12a9-708d-4e73-9619-22a14658ed25'))
// 'customer1'
// select * from  users
//  left join sessions
// on users.user_id=sessions.user_id
// where user_name = $1;
