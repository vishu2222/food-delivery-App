import { addAddress, getAddress } from '../models/customer.js'

export async function addCustomerAddress(req, res) {
  try {
    const customerId = req.customerId
    const address = req.body

    await addAddress(address, customerId)

    return res.sendStatus(201)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function getCustomerAddress(req, res) {
  try {
    const customerId = req.customerId

    const addressess = await getAddress(customerId)
    if (addressess.length === 0) {
      return res.status(404).json({ msg: 'no saved addressess found' })
    }
    res.json(addressess)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
}
