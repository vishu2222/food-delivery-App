export const updatePartnerLocation = (position) => {
  return {
    type: 'partnerLocationUpdate',
    payload: position
  }
}

export const setRestaurantId = (restaurantId) => {
  return {
    type: 'add/restaurant',
    payload: restaurantId
  }
}

export const addUserType = (userType) => {
  return {
    type: 'user',
    payload: userType
  }
}

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

// export const setDelivaryAddress = (addressId) => {
//   return {
//     type: 'delivary/address',
//     payload: addressId
//   }
// }

export const setDelivaryAddress = (address) => {
  return {
    type: 'delivary/address',
    payload: address
  }
}

export const removeDelivaryAddress = (addressId) => {
  return {
    type: 'clear/address',
    payload: addressId
  }
}
