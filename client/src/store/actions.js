export const addUserName = (userName) => {
  return {
    type: 'add/userName',
    payload: userName
  }
}

export const isUserSignedIn = (value) => {
  return {
    type: 'user/signedIn',
    payload: value
  }
}

export const updatePartnerLocation = (position) => {
  return {
    type: 'partnerLocationUpdate',
    payload: position
  }
}

export const clearRestaurant = () => {
  return {
    type: 'clear/restaurant'
  }
}

export const clearPartnerLocation = () => {
  return {
    type: 'clear/partnerLocation'
  }
}

export const clearDeliveryAddress = () => {
  return {
    type: 'clear/address'
  }
}

export const setRestaurant = (restaurant) => {
  return {
    type: 'add/restaurant',
    payload: restaurant
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
