import React from 'react'
import { useState, useEffect } from 'react'
import { getAllOrders } from '../requests.js'

function MyOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    ;(async () => {
      const res = await getAllOrders()
      console.log(res)
    })()
  }, [])
  return <div></div>
}

export default MyOrders
