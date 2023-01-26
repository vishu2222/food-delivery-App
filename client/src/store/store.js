import { configureStore } from '@reduxjs/toolkit'
import restaurantReducer from '../slices/restaurantSlice'
import cartReducer from '../slices/cartSlice'

const store = configureStore({
  reducer: {
    focusedRestaurant: restaurantReducer,
    cartItems: cartReducer
  }
})

export default store
