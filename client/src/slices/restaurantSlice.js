import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  restaurant: ''
}

export const restaurantSlice = createSlice({
  name: 'focusedRestaurant',
  initialState,
  reducers: {
    focusedRestaurant: (state, action) => {
      state.restaurant = action.payload
    }
  }
})

export const { focusedRestaurant } = restaurantSlice.actions
export default restaurantSlice.reducer
