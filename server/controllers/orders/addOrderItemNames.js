import { getItemNames } from '../../models/orders.js'

export async function addOrderItemNames(orderItems) {
  let itemNames = await getItemNames(Object.keys(orderItems))

  itemNames = itemNames.map((item) => {
    item.quantity = orderItems[item.item_id]
    return item
  })

  return itemNames
}
