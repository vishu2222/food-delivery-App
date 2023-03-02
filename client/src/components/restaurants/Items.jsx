import React from 'react'

function Items({ item }) {
  const itemName = item.item_name
  const quantity = item.quantity
  return (
    <div className='flex'>
      {quantity}:{itemName} &nbsp;
    </div>
  )
}

export default Items
