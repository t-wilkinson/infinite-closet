import { configureStore } from '@reduxjs/toolkit'
import productsSlice from '@/Products/slice'
import layoutSlice from '@/Layout/slice'
import shopSlice from '@/Shop/slice'
import accountSlice from '@/Account/slice'
import userSlice from '@/User/slice'

import {
  TypedUseSelectorHook,
  useSelector as useSelector_,
  useDispatch as useDispatch_,
} from 'react-redux'

const store = configureStore({
  reducer: {
    user: userSlice,
    layout: layoutSlice,
    products: productsSlice,
    account: accountSlice,
    shop: shopSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useDispatch = () => useDispatch_<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = useSelector_
