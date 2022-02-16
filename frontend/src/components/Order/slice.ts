import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '@/utils/store'
import { Summary } from '@/types'
import { StrapiOrder } from '@/types/models'

import { CartItems, Orders, State } from './types'
import * as api from './api'
import * as cartApi from './Cart/api'
import * as favoritesApi from './Favorite/api'

const initialState: State = {
  checkoutCart: [],
  checkoutHistory: [],
  favorites: [],
}

export const getUser = (getState: () => any) =>
  (getState() as RootState).user.data

const toKey = (order: StrapiOrder) => `${order.size}_${order.product.id}`

export const OrderUtils = {
  set: createAsyncThunk<Orders, Orders>(
    'orders/set',
    async (orders, { getState }) => {
      const user = getUser(getState)
      const uniqueOrders: Orders = Object.values(
        orders.reduce((acc, order) => {
          acc[toKey(order)] = order
          return acc
        }, {})
      )
      api.setOrders(user, uniqueOrders)
      return orders
    }
  ),
  summary: createAsyncThunk<Summary, void>(
    'orders/summary',
    async (_, { getState }) => {
      const user = getUser(getState)
      let data = await cartApi.cartSummary(user)
      return data
    }
  ),
  count: createAsyncThunk<number, void>(
    'orders/count',
    async (_, { getState }) => {
      const user = getUser(getState)
      if (user) {
        return await api.countUserOrders()
      } else {
        const orders = api.getGuestOrders()
        return orders.length
      }
    }
  ),
  favorites: createAsyncThunk<Orders, void>(
    'orders/favorites',
    async (_, { getState }) => {
      const user = getUser(getState)
      return favoritesApi.getFavorites(user)
    }
  ),
  view: createAsyncThunk<CartItems, void>(
    'orders/view',
    async (_, { getState }) => {
      const user = getUser(getState)
      return cartApi.viewCart(user)
    }
  ),
  history: createAsyncThunk<CartItems, void>(
    'orders/history',
    async (_, { getState }) => {
      const user = getUser(getState)
      return api.checkoutHistory(user)
    }
  ),
  update: createAsyncThunk<void, Partial<StrapiOrder>>(
    'orders/update',
    async (order, { getState }) => {
      const user = getUser(getState)
      if (user) {
        await api.updateUserOrder(order)
      } else {
        await api.updateGuestOrder(order)
        const orders = api.getGuestOrders()
        const index = orders.findIndex((v: StrapiOrder) => v.id === order.id)
        orders[index] = { ...orders[index], ...order }
        api.setGuestOrders(orders)
      }
    }
  ),
  add: createAsyncThunk<CartItems, Partial<StrapiOrder>>(
    'orders/add',
    async (order, { rejectWithValue, getState }) => {
      const user = getUser(getState)
      if (user) {
        await api.createUserOrder(order)
      } else {
        order = await api.createGuestOrder(order)
        const orders = [...api.getGuestOrders(), order as StrapiOrder]
        api.setGuestOrders(orders)
      }
      return await cartApi.viewCart(user)
    }
  ),
  insert: createAsyncThunk<
    CartItems,
    Partial<StrapiOrder>[] | Partial<StrapiOrder>
  >('orders/insert', async (inserts, { getState }) => {
    const user = getUser(getState)
    if (!user) {
      return
    }

    if (!Array.isArray(inserts)) {
      inserts = [inserts]
    }

    const orders = await cartApi.getCart(user)
    const orderIds = orders
      .concat(inserts as Orders)
      .map((order: StrapiOrder) => order.id)
    api.setUserOrders(user, orderIds)
    return await cartApi.viewCart(user)
  }),
  remove: createAsyncThunk<Orders, string>(
    'orders/remove',
    async (id, { getState }) => {
      const user = getUser(getState)
      if (user) {
        await api.updateUserOrder({id, status: 'dropped'})
      } else {
        const orders = api.getGuestOrders()
        const filtered = orders.filter((order: StrapiOrder) => order.id !== id)
        api.setGuestOrders(filtered)
      }
      return cartApi.getCart(user)
    }
  ),
}

export const slice = createSlice({
  name: 'ORDERS',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      OrderUtils.summary.fulfilled,
      (state, action: PayloadAction<Summary>) => {
        state.checkoutSummary = action.payload
      }
    )
    builder.addCase(
      OrderUtils.insert.fulfilled,
      (state, action: PayloadAction<CartItems>) => {
        state.checkoutCart = action.payload
        state.count = Object.values(action.payload).length
      }
    )
    builder.addCase(
      OrderUtils.view.fulfilled,
      (state, action: PayloadAction<CartItems>) => {
        state.checkoutCart = action.payload
        state.count = Object.values(action.payload).length
      }
    )
    builder.addCase(
      OrderUtils.history.fulfilled,
      (state, action: PayloadAction<CartItems>) => {
        state.checkoutHistory = action.payload
        state.count = Object.values(action.payload).length
      }
    )
    builder.addCase(
      OrderUtils.count.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.count = action.payload
      }
    )
    builder.addCase(OrderUtils.remove.fulfilled, (state) => {
      state.count = state.count - 1
    })
    builder.addCase(
      OrderUtils.add.fulfilled,
      (state, action: PayloadAction<CartItems>) => {
        state.checkoutCart = action.payload
        state.count = action.payload.length
      }
    )
    builder.addCase(OrderUtils.add.rejected, () => {
      throw 'Failed to add order'
    })
    builder.addCase(
      OrderUtils.favorites.fulfilled,
      (state, action: PayloadAction<Orders>) => {
        state.favorites = action.payload
      }
    )
  },
})

export const ordersActions = slice.actions
export default slice.reducer
