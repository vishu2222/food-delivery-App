export const addToCart = (newItem) => {
  return {
    type: 'cart/addItem',
    payload: newItem
  }
}

export const incrementCartItem = (item) => {
  return {
    type: 'cart/incrementItem',
    payload: item
  }
}

export const decrementCartItem = (item) => {
  return {
    type: 'cart/decrementItem',
    payload: item
  }
}

export const removeCartItem = (item) => {
  return {
    type: 'cart/removeItem',
    payload: item
  }
}

export const clearCart = () => {
  return {
    type: 'cart/clearCart'
  }
}
