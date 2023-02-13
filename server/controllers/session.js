import { getUserDetails, createSession } from '../models/sessions.js'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

export async function userLogin(req, res) {
  try {
    const userName = req.body.userName
    const password = req.body.password
    const userType = req.body.userType

    if (!['customer', 'restaurant', 'delivery_partner'].includes(userType)) {
      return res.status(400).json({ msg: 'invalid user type' })
    }

    const userDetails = await getUserDetails(userName, userType)

    if (!(await bcrypt.compare(password, userDetails.password))) {
      return res.status(401).json({ msg: 'wrong password' })
    }

    const sessionId = uuid()
    await createSession(sessionId, userDetails.user_id)

    return res
      .cookie('sessionId', sessionId, { maxAge: 10 * 60 * 1000, httpOnly: true })
      .status(201)
      .json({ userType })
  } catch (error) {
    if (error.message === 'invalidUserName') {
      return res.status(401).json({ msg: 'invalid user name' })
    }

    if (error.code === '42P01') {
      //  userType is different from actual userrole
      return res.sendStatus(403)
    }

    console.log('userLogin', error)
    res.sendStatus(500)
  }
}

export async function authorizeUser(req, res) {
  return res.status(200).json({ userRole: req.userRole })
}

// const deviceid = req.headers['user-agent']
