import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  restaurantId: ''
}

export const restaurantSlice = createSlice({
  name: 'focusedRestaurant',
  initialState,
  reducers: {
    setFocusedRestaurant: (state, action) => {
      state.restaurantId = action.payload
    }
  }
})

export const { setFocusedRestaurant } = restaurantSlice.actions
export default restaurantSlice.reducer
