import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { enableMapSet } from 'immer'

enableMapSet()

import productsSlice from '@/Product/slice'
import layoutSlice from '@/Layout/slice'
import shopSlice from '@/Product/ProductPage/slice'
import rootSlice from '../components/slice'
import userSlice from '@/User/slice'
import ordersSlice from '@/Order/slice'
import wardrobeSlice from '@/Wardrobe/slice'

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
    root: rootSlice,
    shop: shopSlice,
    orders: ordersSlice,
    wardrobe: wardrobeSlice,
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
