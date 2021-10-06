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
    let res: unknown & { data: Cart }
    if (user) {
      res = await axios.get(`/orders/cart/view/${user.id}`, {
        withCredentials: true,
      })
    } else {
      const orders = helpers.getGuestOrders()
      res = await axios.post(`/orders/cart/view`, { orders })
    }
    return res.data
  }),
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
  add: createAsyncThunk<void, Partial<StrapiOrder>>(
    'cart/add',
    async (order, { getState }) => {
      const user = getUser(getState)
      if (user) {
        axios.post('/orders', order, { withCredentials: true })
      } else {
        order = await axios.post('/orders', order).then((res) => res.data)
        const orders = [...helpers.getGuestOrders(), order as StrapiOrder]
        helpers.setGuestOrders(orders)
      }
    }
  ),
  // insert: createAsyncThunk<Orders, Partial<StrapiOrder>[] | Partial<StrapiOrder>>(
  //   'cart/insert',
  //   async (inserts, { getState }) => {
  //     if (!Array.isArray(inserts)) {
  //       inserts = [inserts]
  //     }

  //     const user = getUser(getState)
  //     const orders = await helpers.getOrders(user)
  //     const orderIds = orders
  //       .concat(inserts as Orders)
  //       .map((order: StrapiOrder) => order.id)
  //     helpers.setOrders(user, orderIds)
  //     return orders
  //   }
  // ),
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
