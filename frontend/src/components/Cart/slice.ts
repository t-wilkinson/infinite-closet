import { createSlice } from '@reduxjs/toolkit'

import { RootState } from '@/utils/store'

import CartUtils from './utils'
import { State } from './types'

export { CartUtils }

// TODO: store cart here for caching
const initialState: State = {
  checkoutCart: [],
}

export const getUser = (getState: any) => (getState() as RootState).user.data

export const slice = createSlice({
  name: 'CART',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CartUtils.summary.fulfilled, (state, action) => {
      state.checkoutSummary = action.payload
    })
    builder.addCase(CartUtils.view.fulfilled, (state, action) => {
      state.checkoutCart = action.payload
      state.count = Object.values(action.payload).length
    })
    builder.addCase(CartUtils.count.fulfilled, (state, action) => {
      state.count = action.payload
    })
    builder.addCase(CartUtils.remove.fulfilled, (state) => {
      state.count = state.count - 1
    })
    builder.addCase(CartUtils.add.fulfilled, (state) => {
      state.count = state.count + 1
    })
  },
})

const cartSelector = (state: RootState) => state.cart
const cartSelectors = {
  cartSelector,
}

export { cartSelectors }
export const cartActions = slice.actions
export default slice.reducer
