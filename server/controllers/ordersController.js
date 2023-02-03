import { addRestaurantConfirmation, getRestaruantsAddress } from '../models/queries.js'
import { addDelivaryPartner, getDelivaryPartnerDetails } from '../models/queries.js'
import socket from '../sockets/sockets.js'
import { getPartnersLoc } from '../sockets/sockets.js'
import { getDistance } from 'geolib'

export async function restaurantsOrderUpdate(req, res) {
  try {
    const orderId = req.params.order_id
    const confirmation = req.body.confirmation
    const io = socket.get()

    if (confirmation === 'decline') {
      io.emit('customer-update', { msg: 'declined', details: 'restaurant cancelled your order' }) // io.to()
      // case customer disconets for a while
      return res.json({ msg: 'order declined', status: 'success' })
    }

    await addRestaurantConfirmation(orderId)
    // io.emit('restaurant-update', {msg: 'confirmation-recived', details: 'order confirmation recieved'})
    io.emit('customer-update', { msg: 'accepted', details: 'restaurant accepted your order' }) // io.to()
    await assignDelivaryPartner(orderId)

    return res.json({ msg: 'confirmation recived', status: 'success' }) // response socket or http?
  } catch (err) {
    const io = socket.get()
    io.emit('customer-update', { msg: 'server-err', details: 'sorry unable to process your order' })
    // io.emit('restaurant-update') // ask restaurant to cancel the order, server error
    return res.status(500).json({ err: 'internal error', msg: 'unable to confirm order' })
  }
}

async function assignDelivaryPartner(orderId) {
  try {
    const io = socket.get()
    io.emit('customer-update', { msg: 'searching for delivary partners' })
    // io.emit('restaurant-update') // update restaurant, 'searching for delivary partners'

    const restaurantsLocation = await getRestaruantsAddress(orderId)
    io.emit('partner-location', 'need your current location')

    const partnerId = await findNearBydelivaryPartner(restaurantsLocation.lat, restaurantsLocation.long)
    io.emit('')
    await addDelivaryPartner(orderId, partnerId)

    io.emit('update-delivary-partner', { msg: 'pick-up', details: restaurantsLocation })
    const partnerDetails = await getDelivaryPartnerDetails(partnerId)
    io.emit('customer-update', { msg: 'delivary-assigned', details: partnerDetails })
    // io.emit('restaurant-update',  { msg: 'delivary-assigned', details: partnerDetails }) // notify res delivery agent will be comming for pickup
  } catch (err) {
    throw new Error('could not assign delivary partner')
  }
}

async function findNearBydelivaryPartner(latitude, longitude) {
  try {
    const partnerLocations = await getPartnersLoc()
    // case: partners list empty
    // filter partners list by their availability
    const partnerDistances = partnerLocations.map((partner) => [partner.partnerId, getDistance(partner.loc, { latitude, longitude })])
    const nearestPartner = partnerDistances.reduce(
      (nearest, partner) => {
        if (partner[1] < nearest[1]) return partner
        return nearest
      },
      [null, Infinity]
    )

    const partnerId = nearestPartner[0]

    return partnerId
  } catch (err) {
    throw new Error('could not find near by delivary partner')
  }
}
