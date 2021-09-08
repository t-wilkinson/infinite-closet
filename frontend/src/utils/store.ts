import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import productsSlice from '@/Products/slice'
import layoutSlice from '@/Layout/slice'
import shopSlice from '@/Shop/slice'
import accountSlice from '@/Account/slice'
import userSlice from '@/User/slice'
import cartSlice from '@/Cart/slice'

import {
  TypedUseSelectorHook,
  useSelector as useSelector_,
  useDispatch as useDispatch_,
} from 'react-redux'

export const storeOptions = {
  reducer: {
    user: userSlice,
    layout: layoutSlice,
    products: productsSlice,
    account: accountSlice,
    shop: shopSlice,
    cart: cartSlice,
  },
  middleware: [thunk],
  // middleware: (getDefaultMiddleware: any) => [
  //   ...getDefaultMiddleware({
  //     serializableCheck: false,
  //   }),
  //   thunk,
  // ],
}

const store = configureStore(storeOptions)

export default store
export type Store = typeof store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch | any
// | ThunkAction<void, RootState, unknown, AnyAction>
export const useDispatch = () => useDispatch_<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = useSelector_
