import React, { useState } from 'react'
import { updateOrder } from './partnerRequests'
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react'

function Order({ order, index }) {
  const orderId = order.order_id

  const orderTime = order.order_time
  const [status, setStatus] = useState(order.status)
  const totalPrice = order.total_price

  async function updateDelivary(statusUpdate) {
    const [responseStatus, orderStatus] = await updateOrder(orderId, statusUpdate)

    if (responseStatus !== 200) {
      //
      console.log('responseStatus:', responseStatus)
      return
    }
    setStatus(orderStatus.msg)
  }

  return (
    <div>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Restaurant name</Th>
              <Th>Restaurant address</Th>
              <Th>Phone</Th>
              <Th>order amount</Th>
              <Th>order status</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{order.restaurant_name}</Td>
              <Td>{order.address}</Td>
              <Td>{order.phone}</Td>
              <Td>₹{totalPrice}</Td>
              <Td>{status}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <div className='flex justify-around p-2'>
        <button className='btn' onClick={() => updateDelivary('awaiting delivery')}>
          pickup
        </button>
        <button className='btn' onClick={() => updateDelivary('delivered')}>
          deliver
        </button>
      </div>
    </div>
  )
}

export default Order
