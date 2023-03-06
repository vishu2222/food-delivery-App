import { getUserDetails, createSession, deleteSession } from '../models/sessions.js'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

export async function userLogin(req, res) {
  try {
    const userName = req.body.userName
    const password = req.body.password

    const userDetails = await getUserDetails(userName)

    // console.log('userDetails', userDetails)

    if (!(await bcrypt.compare(password, userDetails.password))) {
      return res.status(401).json({ msg: 'wrong password' })
    }

    const sessionId = uuid()
    await createSession(sessionId, userDetails.user_id)

    return res
      .cookie('sessionId', sessionId, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
      .status(201)
      .json({ user_type: userDetails.user_type })
  } catch (error) {
    if (error.message === 'invalidUserName') {
      return res.status(401).json({ msg: 'invalid user name' })
    }
    res.sendStatus(500)
  }
}

export async function authorizeUser(req, res) {
  return res.status(200).json({ userRole: req.userRole })
}

export async function logout(req, res) {
  await deleteSession(req.sessionId)
  return res.clearCookie('sessionId').sendStatus(200)
}

// const deviceid = req.headers['user-agent']
