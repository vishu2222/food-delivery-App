import { createSlice, current } from '@reduxjs/toolkit'

const initialState = {
  cart: []
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // console.log('adding to cart, payload:', action.payload)
      state.cart.push({ ...action.payload, count: 1 })
      // console.log('cart after adding to cart:', current(state.cart))
    },

    incrementItem: (state, action) => {
      const existingItem = state.cart.find((item) => item.item_id === action.payload.item_id)
      // console.log('incrementing existingItem:', current(existingItem))
      existingItem.count++
      // console.log('cart after incrementing existingItem:', current(state.cart))
    },

    decrementItem: (state, action) => {
      const existingItem = state.cart.find((item) => item.item_id === action.payload.item_id)
      // console.log('decrementing existingItem:', current(existingItem))
      existingItem.count--
      // console.log('cart after decrementing existingItem:', current(state.cart))
    },

    removeItem: (state, action) => {
      // console.log('removing existingItem paylod:', action.payload.item_id)
      state.cart = state.cart.filter((item) => item.item_id !== action.payload.item_id)
      // console.log('state after removing existingItem:', current(state))
    }
  }
})

export const { addToCart, incrementItem, decrementItem, removeItem } = cartSlice.actions
export default cartSlice.reducer
