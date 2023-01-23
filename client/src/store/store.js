import { configureStore } from '@reduxjs/toolkit'
import restaurantReducer from '../slices/restaurantSlice'

const store = configureStore({
  reducer: {
    focusedRestaurant: restaurantReducer
  }
})

export default store
