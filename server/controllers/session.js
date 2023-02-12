import { getUserCredentials } from '../models/sessions.js'
import bcrypt from 'bcrypt'

export async function userLogin(req, res) {
  try {
    const userName = req.body.userName
    const password = req.body.password
    const response = await getUserCredentials(userName)
    if (response.length === 0) return res.status(401).json({ msg: 'invalid user name' }) //redirect('http://localhost:3001/')

    const credentials = response[0]

    if (await bcrypt.compare(password, credentials.password)) {
      console.log(credentials)
      const sessionId = uuid()
      return
    }

    res.status(401).json({ msg: 'wrong password' })
  } catch (error) {
    console.log(error)
  }
}
