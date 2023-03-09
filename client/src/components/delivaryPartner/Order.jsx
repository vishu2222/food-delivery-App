import React, { useState } from 'react'
import { updateOrder } from './partnerRequests'
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react'

function Order({ order }) {
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

    console.log('responseStatus:', responseStatus, 'orderStatus:', orderStatus)

    //
    // updateOrder(notification.order_id, notification.status)

    //   function updateOrder(orderId, orderStatus) {
    //     const updatedOrders = orders.map((order) => {
    //       if (order.order_id === Number(orderId)) {
    //         order['status'] = orderStatus
    //         return order
    //       }
    //       return order
    //     })

    //     setOrders(updatedOrders)
    //

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
        <button
          className='btn hover:border-slate-700  transform  hover:scale-125  transition duration-200 cursor-pointer hover:bg-black  hover:text-white'
          onClick={() => updateDelivary('awaiting delivery')}>
          pickup
        </button>
        <button
          className='btn hover:border-slate-700  transform  hover:scale-125  transition duration-200 cursor-pointer  hover:bg-black  hover:text-white'
          onClick={() => updateDelivary('delivered')}>
          deliver
        </button>
      </div>
    </div>
  )
}

export default Order
