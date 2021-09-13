import axios from 'axios'
import * as storage from '@/utils/storage'

import { StrapiUser, StrapiOrder } from '@/utils/models'
import { Cart } from './types'

export function getGuestCart() {
  let cart = storage.get('cart') || []

  switch (Object.prototype.toString.call(cart)) {
    case '[object Object]':
      cart = Object.values(cart)
      storage.set('cart', cart)
      break
    case '[object Array]': // Cart should be an object
      break
    default:
      // If we can't current cart value, reset it
      cart = []
      storage.set('cart', cart)
      break
  }

  return cart.filter((order: StrapiOrder) => !order.user)
}

export async function getUserCart(user: StrapiUser) {
  const res = await axios.get(`/orders/cart/${user.id}`, {
    withCredentials: true,
  })
  const cart = res.data
  return cart
}

export async function getCart(user: StrapiUser): Promise<Cart> {
  if (user) {
    return getUserCart(user)
  } else {
    return getGuestCart()
  }
}

export async function setUserCart(user: StrapiUser, cart: Cart | string[]) {
  await axios.put(
    `/orders/cart/${user.id}`,
    { cart },
    { withCredentials: true }
  )
}

export function setGuestCart(cart: Cart | string[]) {
  storage.set('cart', cart)
}

export async function setCart(
  user: StrapiUser,
  cart: Cart | string[]
): Promise<void> {
  if (user) {
    setUserCart(user, cart)
  } else {
    setGuestCart(cart)
  }
}
