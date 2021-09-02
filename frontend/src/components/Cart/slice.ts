import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import axios from 'axios'

import { RootState } from '@/utils/store'
import * as storage from '@/utils/storage'
import { StrapiOrder } from '@/utils/models'

export interface State {
  cart?: Cart
}

type Cart = {
  [key: string]: StrapiOrder
}

const initialState: State = {}

const getUser = (getState) => (getState() as RootState).user.data

async function getCart(user) {
  if (user) {
    const res = await axios.get(`/orders/cart/${user.id}`, {
      withCredentials: true,
    })
    const cart = res.data
    return cart
  } else {
    const cart = storage.get('cart') || {}
    return Object.values(cart).filter((order: StrapiOrder) => !order.user)
  }
}

async function setCart(user, cart) {
  if (user) {
    await axios.put(
      `/orders/cart/${user.id}`,
      { cart },
      { withCredentials: true }
    )
  } else {
    storage.set('cart', cart)
    storage.set('cart-used', true)
  }
}

export const toKey = (order: StrapiOrder) => {
  if (!order) {
    return
  }

  let productID: unknown
  if (order.product === undefined) {
    productID = undefined
  } else if (order.product.id !== undefined) {
    productID = order.product.id
  } else {
    productID = order.product
  }
  return `${order.size}_${productID}`
}

export const CartUtils = {
  get: createAsyncThunk<Cart, void>('cart/get', async (_, { getState }) => {
    const user = getUser(getState)
    return await getCart(user)
  }),
  set: createAsyncThunk<Cart, Cart>('cart/set', async (cart, { getState }) => {
    const user = getUser(getState)
    setCart(user, cart)
    return cart
  }),
  insert: createAsyncThunk<void, StrapiOrder[]>(
    'cart/set',
    async (items, { getState }) => {
      const user = getUser(getState)
      const state = getState() as RootState
      let cart = state.cart.cart
      if (!Array.isArray(items)) {
        items = [items]
      }

      items.forEach((item) => {
        cart[toKey(item)] = item
      })

      setCart(user, cart)
    }
  ),
  remove: createAsyncThunk<void, StrapiOrder[]>(
    'cart/set',
    async (items, { getState }) => {
      const user = getUser(getState)
      const state = getState() as RootState
      let cart = state.cart.cart
      if (!Array.isArray(items)) {
        items = [items]
      }

      items.forEach((item) => {
        delete cart[toKey(item)]
      })

      setCart(user, cart)
    }
  ),
}

export const slice = createSlice({
  name: 'CART',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CartUtils.get.fulfilled, (state, action) => {
      state.cart = action.payload
    })
    builder.addCase(CartUtils.set.fulfilled, (state, action) => {
      state.cart = action.payload
    })
  },
})

const cartSelector = (state: RootState) => state.cart
const cartSelectors = {
  cartSelector,
  count: createSelector(
    [cartSelector],
    (cart) => Object.values(cart.cart).length
  ),
}

export { cartSelectors }
export const cartActions = slice.actions
export default slice.reducer
