import { registerCustomer } from '../models/users.js'
import bcrypt from 'bcrypt'

export async function registerUser(req, res) {
  if (req.body.userType === 'customer') {
    addNewCustomer(req, res)
    return
  }

  if (req.body.userType === 'restaurant') {
    addNewRestaurant(req, res)
    return
  }

  addNewPartner(req, res)
}

async function addNewCustomer(req, res) {
  try {
    const credentials = req.body
    const userName = credentials.userName
    const userType = credentials.userType
    const password = credentials.password
    const customerName = credentials.customerName
    const phone = credentials.phone
    const email = credentials.email

    const salt = await bcrypt.genSalt()
    const hashedPwd = await bcrypt.hash(password, salt)

    await registerCustomer(userName, userType, hashedPwd, customerName, phone, email)
    return res.sendStatus(201)
  } catch (err) {
    if (err.message === 'userExists') {
      return res.status(409).json({ msg: 'user name already registered', code: err.message })
    }
    if (err.message === 'phoneExists') {
      return res.status(409).json({ msg: 'phone number already registered', code: err.message })
    }
    return res.sendStatus(500)
  }
}

async function addNewRestaurant(req, res) {
  //
}

async function addNewPartner(req, res) {
  //
}
