import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  restaurant: ''
}

export const restaurantSlice = createSlice({
  name: 'focusedRestaurant',
  initialState,
  reducers: {
    setFocusedRestaurant: (state, action) => {
      console.log('resAction:', action)
      state.restaurant = action.payload
    }
  }
})

export const { setFocusedRestaurant } = restaurantSlice.actions
export default restaurantSlice.reducer
