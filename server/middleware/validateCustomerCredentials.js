export function validateCustomerCredentials(req, res, next) {
  const credentials = req.body
  const userName = credentials.userName
  const userType = credentials.userType
  const password = credentials.password
  const customerName = credentials.customerName
  const phone = credentials.phone
  const email = credentials.email

  if (userName.trim().length === 0) {
    return res.status(400).json({ msg: 'invalid userName' })
  }

  if (customerName.trim().length === 0) {
    return res.status(400).json({ msg: 'invalid name' })
  }

  if (password.length < 4) {
    return res.status(400).json({ msg: 'pasword too short' })
  }

  if (password.match(/[\w]*[\d][\w]*/) === null) {
    return res.status(400).json({ msg: 'password should contain atleast 1 digit' })
  }

  if (password.match(/[\w]*[a-zA-Z][\w]*/) === null) {
    return res.status(400).json({ msg: 'password should contain atleast 1 letter' })
  }

  if (!['customer', 'partner', 'restaurant'].includes(userType)) {
    return res.status(400).json({ msg: 'invalid user type' })
  }

  if (phone.match(/\d{10}/) === null || phone.length !== 10) {
    return res.status(400).json({ msg: 'invalid mobile number' })
  }

  if (email.length !== 0 && email.match(/\w+[@]\w+/) === null) {
    return res.status(400).json({ msg: 'invalid email' })
  }

  next()
}
