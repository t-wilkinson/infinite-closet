import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import { RootState } from '@/utils/store'
import { StrapiOrder } from '@/utils/models'

import * as helpers from './helpers'
import { Orders, Cart } from './types'

export const getUser = (getState: () => any) =>
  (getState() as RootState).user.data

const toKey = (order: StrapiOrder) => `${order.size}_${order.product.id}`

export default {
  get: createAsyncThunk<Orders, void>('cart/get', async (_, { getState }) => {
    const user = getUser(getState)
    return await helpers.getOrders(user)
  }),
  set: createAsyncThunk<Orders, Orders>(
    'cart/set',
    async (orders, { getState }) => {
      const user = getUser(getState)
      const uniqueOrders: Orders = Object.values(
        orders.reduce((acc, order) => {
          acc[toKey(order)] = order
          return acc
        }, {})
      )
      helpers.setOrders(user, uniqueOrders)
      return orders
    }
  ),
  summary: createAsyncThunk<Cart, void>(
    'cart/summary',
    async (_, { getState }) => {
      const user = getUser(getState)
      const orders = await helpers.getOrders(user)
      let res: unknown & { data: Cart }
      if (user) {
        res = await axios.post(
          `/orders/cart/summary`,
          { orders },
          {
            withCredentials: true,
          }
        )
      } else {
        res = await axios.post(`/orders/cart/summary`, {
          orders,
        })
      }
      return res.data
    }
  ),
  count: createAsyncThunk<number, void>(
    'cart/count',
    async (_, { getState }) => {
      const user = getUser(getState)
      if (user) {
        return await axios.get('/orders/cart/count', { withCredentials: true })
      } else {
        const orders = helpers.getGuestOrders()
        return orders.length
      }
    }
  ),
  view: createAsyncThunk<Cart, void>('cart/view', async (_, { getState }) => {
    const user = getUser(getState)
    return helpers.viewOrders(user)
  }),
  history: createAsyncThunk<Cart, void>(
    'cart/history',
    async (_, { getState }) => {
      const user = getUser(getState)
      return helpers.orderHistory(user)
    }
  ),
  update: createAsyncThunk<void, Partial<StrapiOrder>>(
    'cart/update',
    async (order, { getState }) => {
      const user = getUser(getState)
      if (user) {
        await axios.put(`/orders/${order.id}`, order, { withCredentials: true })
      } else {
        await axios.put(`/orders/${order.id}`, order)
        const orders = helpers.getGuestOrders()
        const index = orders.findIndex((v: StrapiOrder) => v.id === order.id)
        orders[index] = { ...orders[index], ...order }
        helpers.setGuestOrders(orders)
      }
    }
  ),
  add: createAsyncThunk<Cart, Partial<StrapiOrder>>(
    'cart/add',
    async (order, { getState }) => {
      const user = getUser(getState)
      if (user) {
        await axios.post('/orders', order, { withCredentials: true })
      } else {
        order = await axios.post('/orders', order).then((res) => res.data)
        const orders = [...helpers.getGuestOrders(), order as StrapiOrder]
        helpers.setGuestOrders(orders)
      }
      return await helpers.viewOrders(user)
    }
  ),
  insert: createAsyncThunk<Cart, Partial<StrapiOrder>[] | Partial<StrapiOrder>>(
    'cart/insert',
    async (inserts, { getState }) => {
      const user = getUser(getState)
      if (!user) {
        return
      }

      if (!Array.isArray(inserts)) {
        inserts = [inserts]
      }

      const orders = await helpers.getUserOrders(user)
      const orderIds = orders
        .concat(inserts as Orders)
        .map((order: StrapiOrder) => order.id)
      helpers.setUserOrders(user, orderIds)
      return await helpers.viewOrders(user)
    }
  ),
  remove: createAsyncThunk<Orders, string>(
    'cart/remove',
    async (id, { getState }) => {
      const user = getUser(getState)
      if (user) {
        await axios.put(
          `/orders/${id}`,
          { id, status: 'dropped' },
          { withCredentials: true }
        )
      } else {
        const orders = helpers.getGuestOrders()
        const filtered = orders.filter((order: StrapiOrder) => order.id !== id)
        helpers.setGuestOrders(filtered)
      }
      return helpers.getOrders(user)
    }
  ),
}
