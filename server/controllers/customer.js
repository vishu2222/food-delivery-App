import { addAddress, getAddress } from '../models/customer.js'
// import { fetchData } from './utils'

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

export async function getCustomerLocation(req, res) {
  // console.log('entered...')
  try {
    const lat = req.body.lat
    const long = req.body.long

    if (!Number(lat) || !Number(long)) return res.sendStatus(400) // assumes 0, 0 is not allowed

    if (Math.abs(lat) > 90 || Math.abs(long) > 180) return res.sendStatus(400)

    // console.log('about to fetch', lat, long, 'key:', process.env.MAP_KEY)
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.MAP_KEY}`
    )

    // console.log('hi1')
    if (response.ok) {
      const data = await response.json()
      console.log(data.results[0])
      return res.json({ result: data.results[0] })
    }

    const result = await response.json()
    // console.log('result:', result)
    return res.status(400).json({ status: result.status })
  } catch (err) {
    // console.log(err)
    res.sendStatus(500)
  }
}
