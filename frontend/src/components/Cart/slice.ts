import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '@/utils/store'
import {Summary} from '@/types'

import CartUtils from './utils'
import { State, Cart } from './types'

export { CartUtils }

// TODO: store cart here for caching
const initialState: State = {
  checkoutCart: [],
  orderHistory: [],
}

export const getUser = (getState: any) => (getState() as RootState).user.data

export const slice = createSlice({
  name: 'CART',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CartUtils.summary.fulfilled, (state, action: PayloadAction<Summary>) => {
      state.checkoutSummary = action.payload
    })
    builder.addCase(CartUtils.insert.fulfilled, (state, action: PayloadAction<Cart>) => {
      state.checkoutCart = action.payload
      state.count = Object.values(action.payload).length
    })
    builder.addCase(CartUtils.view.fulfilled, (state, action: PayloadAction<Cart>) => {
      state.checkoutCart = action.payload
      state.count = Object.values(action.payload).length
    })
    builder.addCase(CartUtils.history.fulfilled, (state, action: PayloadAction<Cart>) => {
      state.orderHistory = action.payload
      state.count = Object.values(action.payload).length
    })
    builder.addCase(CartUtils.count.fulfilled, (state, action: PayloadAction<number>) => {
      state.count = action.payload
    })
    builder.addCase(CartUtils.remove.fulfilled, (state) => {
      state.count = state.count - 1
    })
    builder.addCase(CartUtils.add.fulfilled, (state, action: PayloadAction<Cart>) => {
      state.checkoutCart = action.payload
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
