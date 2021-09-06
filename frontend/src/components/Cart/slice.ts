import { createSlice } from '@reduxjs/toolkit'

import { RootState } from '@/utils/store'

import CartUtils from './utils'
import { State } from './types'

export { CartUtils }

// TODO: store cart here for caching
const initialState: State = {
  checkoutCart: [],
  ordersStatus: [],
}

export const getUser = (getState) => (getState() as RootState).user.data

export const slice = createSlice({
  name: 'CART',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CartUtils.status.fulfilled, (state, action) => {
      state.ordersStatus = action.payload
    })
    builder.addCase(CartUtils.summary.fulfilled, (state, action) => {
      state.checkoutSummary = action.payload
    })
    builder.addCase(CartUtils.view.fulfilled, (state, action) => {
      state.checkoutCart = action.payload
    })
    builder.addCase(CartUtils.count.fulfilled, (state, action) => {
      state.count = action.payload
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
