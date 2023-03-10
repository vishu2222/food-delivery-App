const initialState = {
  cart: [],
  restaurant: {},
  delivaryAddress: {},
  partnerLocation: { lat: null, lng: null },
  userSigned: false,
  userName: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'add/userName':
      return { ...state, userName: action.payload }

    case 'user/signedIn':
      return { ...state, userSigned: action.payload }

    case 'partnerLocationUpdate':
      return { ...state, partnerLocation: action.payload }

    case 'clear/partnerLocation':
      return { ...state, partnerLocation: { lat: null, lng: null } }

    case 'clear/restaurant':
      return { ...state, restaurant: {} }

    case 'clear/address':
      return { ...state, delivaryAddress: {} }

    case 'add/restaurant':
      return { ...state, restaurant: action.payload }

    case 'delivary/address':
      return { ...state, delivaryAddress: action.payload }

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
