import React, { useState } from 'react'
import Items from './Items'
import { updateOrder } from './requests/restaurantRequests'
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button
} from '@chakra-ui/react'

function Order({ order }) {
  const orderId = order.order_id
  const orderItems = order.order_items
  const orderTime = order.order_time
  const [status, setStatus] = useState(order.status)
  const totalPrice = order.total_price

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  async function confirmOrder(confirmation) {
    let status = 'searching for delivery partner'
    if (confirmation === 'reject') {
      status = 'restaurant rejected'
    }

    const [responseStatus, orderStatus] = await updateOrder(orderId, status)

    if (responseStatus !== 200) {
      //
    }
    setStatus(orderStatus.msg)
  }

  return (
    <div className='m-2 p-2'>
      <TableContainer>
        <Table colorScheme='teal'>
          <Thead>
            <Tr>
              <Th>Order-id</Th>
              <Th>order Time</Th>
              <Th>Status</Th>
              <Th>Total price</Th>
              <Th>ORDER ITEMS</Th>
            </Tr>
          </Thead>

          <Tbody className=' font-extralight'>
            <Tr>
              <Td> {orderId}</Td>
              <Td> {orderTime}</Td>
              <Td> {status}</Td>
              <Td>₹{totalPrice}</Td>
              <Td>
                <div className='flex'>
                  {orderItems.map((item, index) => {
                    return (
                      <div key={index}>
                        <Items item={item} />
                      </div>
                    )
                  })}
                </div>
              </Td>
            </Tr>
          </Tbody>
        </Table>
        <div className='flex justify-around p-2'>
          <Button colorScheme='green' onClick={() => confirmOrder('accept')}>
            Accept
          </Button>

          <Button colorScheme='red' onClick={onOpen}>
            Decline
          </Button>
        </div>
      </TableContainer>

      <>
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Decline Order
              </AlertDialogHeader>

              <AlertDialogBody>Are you sure? You want to decline order.</AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme='red'
                  onClick={() => {
                    onClose()
                    confirmOrder('reject')
                  }}
                  ml={3}>
                  decline
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    </div>
  )
}

export default Order
