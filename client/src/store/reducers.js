const initialState = {
  cart: [],
  restaurantId: null,
  delivaryAddress: {},
  partnerLocation: { lat: null, lng: null }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'partnerLocationUpdate':
      return { ...state, partnerLocation: action.payload }

    case 'add/restaurant':
      return { ...state, restaurantId: action.payload }

    case 'delivary/address':
      return { ...state, delivaryAddress: action.payload }

    case 'clear/address':
      return { ...state, delivaryAddressId: null }

    case 'cart/addItem':
      return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] }

    case 'cart/incrementItem':
      const incrementedCart = [...state.cart].map((item) => {
        if (item.item_id !== action.payload.item_id) {
          return item
        }
        return { ...item, quantity: item.quantity + 1 }
      })
      return { ...state, cart: incrementedCart }

    case 'cart/decrementItem':
      const decrementedCart = [...state.cart].map((item) => {
        if (item.item_id !== action.payload.item_id) {
          return item
        }
        return { ...item, quantity: item.quantity - 1 }
      })
      return { ...state, cart: decrementedCart }

    case 'cart/removeItem':
      const filteredCart = [...state.cart].filter((item) => item.item_id !== action.payload.item_id)
      return { ...state, cart: filteredCart }

    case 'cart/clearCart':
      return { ...state, cart: [] }

    default:
      return state
  }
}

export default reducer
