import { configureStore } from '@reduxjs/toolkit'
import restaurantReducer from '../slices/restaurantSlice'
import cartRecucer from '../slices/cartSlice'

const store = configureStore({
  reducer: {
    focusedRestaurant: restaurantReducer,
    cartItems: cartRecucer
  }
})

export default store
