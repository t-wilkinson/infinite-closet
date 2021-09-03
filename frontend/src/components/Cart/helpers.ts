import axios from 'axios'
import * as storage from '@/utils/storage'

import { StrapiOrder } from '@/utils/models'

export function getGuestCart() {
  let cart = storage.get('cart') || []

  switch (Object.prototype.toString.call(cart)) {
    case '[object Object]':
      cart = cart
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

export async function getUserCart(user) {
  const res = await axios.get(`/orders/cart/${user.id}`, {
    withCredentials: true,
  })
  const cart = res.data
  return cart
}

export async function getCart(user) {
  if (user) {
    return getUserCart(user)
  } else {
    return getGuestCart()
  }
}

export async function setUserCart(user, cart) {
  await axios.put(
    `/orders/cart/${user.id}`,
    { cart },
    { withCredentials: true }
  )
}

export function setGuestCart(cart) {
  storage.set('cart', cart)
}

export async function setCart(user, cart) {
  if (user) {
    setUserCart(user, cart)
  } else {
    setGuestCart(cart)
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
