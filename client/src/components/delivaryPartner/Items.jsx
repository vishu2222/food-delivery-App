import React from 'react'

function Items({ item }) {
  const itemName = item.item_name
  const quantity = item.quantity
  return (
    <div>
      <p>
        {itemName}, quantity: {quantity}
      </p>
    </div>
  )
}

export default Items
