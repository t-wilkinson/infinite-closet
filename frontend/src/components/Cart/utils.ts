import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import { RootState } from '@/utils/store'
import { StrapiOrder } from '@/utils/models'

import * as helpers from './helpers'
import { CheckoutCart, Cart } from './types'

export const getUser = (getState: () => any) =>
  (getState() as RootState).user.data

export default {
  get: createAsyncThunk<Cart, void>('cart/get', async (_, { getState }) => {
    const user = getUser(getState)
    return await helpers.getCart(user)
  }),
  summary: createAsyncThunk<Cart, void>(
    'cart/summary',
    async (_, { getState }) => {
      const user = getUser(getState)
      const state = getState() as RootState
      const cart = state.cart.checkoutCart
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
        res = await axios.post(`/orders/cart/summary`, { cart })
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
        const cart = helpers.getGuestCart()
        const index = cart.indexOf((v) => v.id === order.id)
        cart[index] = { ...cart[index], ...order }
        helpers.setGuestCart(cart)
      }
      return helpers.getCart(user)
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
          (order) => !['cart', 'dropped', 'list'].includes(order)
        )
      }
    }
  ),
  set: createAsyncThunk<Cart, Cart>('cart/set', async (cart, { getState }) => {
    const user = getUser(getState)
    helpers.setCart(user, cart)
    return cart
  }),
  add: createAsyncThunk<void, Partial<StrapiOrder>>(
    'cart/add',
    async (order, { getState }) => {
      const user = getUser(getState)
      if (user) {
        axios.post('/orders', order, { withCredentials: true })
      } else {
        const res = await axios.post('/orders', order, {
          withCredentials: true,
        })
        order = res.data

        const cart = helpers.getGuestCart()
        cart.push(order)
        helpers.setGuestCart(cart)
      }
    }
  ),
  insert: createAsyncThunk<Cart, Partial<StrapiOrder>[] | Partial<StrapiOrder>>(
    'cart/insert',
    async (items, { getState }) => {
      const user = getUser(getState)
      let cart = await helpers.getCart(user)
      cart = cart.concat(items)
      helpers.setCart(user, cart)
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
        const index = cart.indexOf((v) => v.id === id)
        cart[index] = { ...cart[index], status: 'dropped' }
        helpers.setGuestCart(cart)
      }
      return helpers.getCart(user)
    }
  ),
}
