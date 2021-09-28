import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import { RootState } from '@/utils/store'
import { StrapiOrder } from '@/utils/models'

import * as helpers from './helpers'
import { CheckoutCart, Cart } from './types'

export const getUser = (getState: () => any) =>
  (getState() as RootState).user.data

const toKey = (order: StrapiOrder) => `${order.size}_${order.product.id}`

export default {
  get: createAsyncThunk<Cart, void>('cart/get', async (_, { getState }) => {
    const user = getUser(getState)
    return await helpers.getCart(user)
  }),
  set: createAsyncThunk<Cart, Cart>('cart/set', async (cart, { getState }) => {
    const user = getUser(getState)
    const uniqueOrders: Cart = Object.values(
      cart.reduce((acc, order) => {
        acc[toKey(order)] = order
        return acc
      }, {})
    )
    helpers.setCart(user, uniqueOrders)
    return cart
  }),
  summary: createAsyncThunk<Cart, void>(
    'cart/summary',
    async (_, { getState }) => {
      const user = getUser(getState)
      const cart = await helpers.getCart(user)
      let res: unknown & { data: Cart }
      if (user) {
        res = await axios.post(
          `/orders/cart/summary`,
          { cart },
          {
            withCredentials: true,
          }
        )
      } else {
        res = await axios.post(`/orders/cart/summary`, {
          cart,
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
        const cart = helpers.getGuestCart()
        return cart.length
      }
    }
  ),
  status: createAsyncThunk<Cart, void>(
    'cart/status',
    async (_, { getState }) => {
      const user = getUser(getState)
      if (user) {
        const res = await axios.get('/orders/status', { withCredentials: true })
        return res.data.orders
      } else {
        const cart = helpers.getGuestCart()
        return cart.filter(
          (order: StrapiOrder) =>
            !['cart', 'dropped', 'list'].includes(order.status)
        )
      }
    }
  ),
  view: createAsyncThunk<CheckoutCart, void>(
    'cart/view',
    async (_, { getState }) => {
      const user = getUser(getState)
      let res: unknown & { data: CheckoutCart }
      if (user) {
        res = await axios.get(`/orders/cart/view/${user.id}`, {
          withCredentials: true,
        })
      } else {
        const cart = helpers.getGuestCart()
        res = await axios.post(`/orders/cart/view`, { cart })
      }
      return res.data
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
        const cart = helpers.getGuestCart()
        const index = cart.findIndex((v: StrapiOrder) => v.id === order.id)
        cart[index] = { ...cart[index], ...order }
        helpers.setGuestCart(cart)
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
        const cart = [...helpers.getGuestCart(), order]
        helpers.setGuestCart(cart)
      }
    }
  ),
  insert: createAsyncThunk<Cart, Partial<StrapiOrder>[] | Partial<StrapiOrder>>(
    'cart/insert',
    async (orders, { getState }) => {
      if (!Array.isArray(orders)) {
        orders = [orders]
      }

      const user = getUser(getState)
      const cart = await helpers.getCart(user)
      const orderIds = cart
        .concat(orders as Cart)
        .map((order: StrapiOrder) => order.id)
      helpers.setCart(user, orderIds)
      return cart
    }
  ),
  remove: createAsyncThunk<Cart, string>(
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
        const cart = helpers.getGuestCart()
        const filtered = cart.filter((order: StrapiOrder) => order.id !== id)
        helpers.setGuestCart(filtered)
      }
      return helpers.getCart(user)
    }
  ),
}
