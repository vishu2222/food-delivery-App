const initialState = {
  cart: [],
  restaurantId: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
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
