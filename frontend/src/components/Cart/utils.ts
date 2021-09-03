import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import { StrapiOrder } from '@/utils/models'
import { RootState } from '@/utils/store'

import * as helpers from './helpers'
import { CheckoutCart, Cart } from './types'

export const getUser = (getState) => (getState() as any).user.data

export default {
  get: createAsyncThunk<Cart, void>('cart/get', async (_, { getState }) => {
    const user = getUser(getState)
    return await helpers.getCart(user)
  }),
  summary: createAsyncThunk<Cart, void | Cart>(
    'cart/summary',
    async (cart, { getState }) => {
      const user = getUser(getState)
      let res
      if (user) {
        res = await axios.get(`/cart/summary/${user.id}`, {
          withCredentials: true,
        })
      } else {
        res = await axios.post(`/cart/summary`, { cart })
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
  view: createAsyncThunk<CheckoutCart, void | Cart>(
    'cart/view',
    async (cart, { getState }) => {
      const user = getUser(getState)
      let res
      if (user) {
        res = await axios.get(`/orders/cart/view/${user.id}`, {
          withCredentials: true,
        })
      } else {
        res = await axios.post(`/orders/cart/view`, { cart })
      }
      return res.data
    }
  ),
  set: createAsyncThunk<Cart, Cart>('cart/set', async (cart, { getState }) => {
    const user = getUser(getState)
    helpers.setCart(user, cart)
    return cart
  }),
  insert: createAsyncThunk<Cart, StrapiOrder[]>(
    'cart/insert',
    async (items, { getState }) => {
      const user = getUser(getState)
      let cart = await helpers.getCart(user)
      cart = cart.concat(items)
      helpers.setCart(user, cart)
      return cart
    }
  ),
  // remove: createAsyncThunk<Cart, StrapiOrder[]>(
  //   'cart/remove',
  //   async (items, { getState }) => {
  //     // TODO:
  //     const user = getUser(getState)
  //     const state = getState() as RootState
  //     let cart = state.cart.checkoutCart

  //     if (!Array.isArray(items)) {
  //       items = [items]
  //     }

  //     items.forEach((item) => {
  //       delete cart[helpers.toKey(item)]
  //     })

  //     helpers.setCart(user, cart)
  //     return cart
  //   }
  // ),
}
