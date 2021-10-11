import axios from 'axios'
import * as storage from '@/utils/storage'

import { StrapiUser, StrapiOrder } from '@/utils/models'
import { Cart, Orders } from './types'

export function getGuestOrders(): Orders {
  let orders = storage.get('cart') || []

  switch (Object.prototype.toString.call(orders)) {
    case '[object Object]':
      orders = Object.values(orders)
      storage.set('cart', orders)
      break
    case '[object Array]': // Cart should be an object
      break
    default:
      // If we can't current cart value, reset it
      orders = []
      storage.set('cart', orders)
      break
  }

  return orders.filter((order: StrapiOrder) => !order.user)
}

export async function getUserOrders(user: StrapiUser): Promise<Orders> {
  const res = await axios.get(`/orders/cart/${user.id}`, {
    withCredentials: true,
  })
  return res.data
}

export async function getOrders(user: StrapiUser): Promise<Orders> {
  if (user) {
    return getUserOrders(user)
  } else {
    return getGuestOrders()
  }
}

export async function setUserOrders(user: StrapiUser, orders: Orders) {
  await axios.put(
    `/orders/cart/${user.id}`,
    { orders },
    { withCredentials: true }
  )
}

export function setGuestOrders(orders: Orders) {
  storage.set('cart', orders)
}

export async function setOrders(
  user: StrapiUser,
  orders: Orders
): Promise<void> {
  if (user) {
    setUserOrders(user, orders)
  } else {
    setGuestOrders(orders)
  }
}

export async function viewOrders(user: StrapiUser): Promise<Cart> {
  let res: unknown & { data: Cart }
  if (user) {
    res = await axios.get(`/orders/cart/view/${user.id}`, {
      withCredentials: true,
    })
  } else {
    const orders = getGuestOrders()
    res = await axios.post(`/orders/cart/view`, { orders })
  }
  return res.data
}
