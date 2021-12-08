import * as storage from '@/utils/storage'
import axios from '@/utils/axios'
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
  return await axios.get(`/orders/cart/${user.id}`)
}

export async function getOrders(user: StrapiUser): Promise<Orders> {
  if (user) {
    return getUserOrders(user)
  } else {
    return getGuestOrders()
  }
}

export async function setUserOrders(
  user: StrapiUser,
  orders: Orders | string[]
): Promise<void> {
  return await axios.put(`/orders/cart/${user.id}`, { orders })
}

export function setGuestOrders(orders: Orders) {
  storage.set('cart', orders)
}

export async function setOrders(
  user: StrapiUser,
  orders: Orders
): Promise<void> {
  if (user) {
    return setUserOrders(user, orders)
  } else {
    return setGuestOrders(orders)
  }
}

export async function viewOrders(user: StrapiUser): Promise<Cart> {
  if (user) {
    return await axios.get(`/orders/cart/view/${user.id}`)
  } else {
    const orders = getGuestOrders()
    return await axios.post(`/orders/cart/view`, { orders }, {withCredentials: false})
  }
}

export async function orderHistory(user: StrapiUser): Promise<Cart> {
  if (user) {
    return await axios.get(`/orders/cart/history/${user.id}`)
  } else {
    return []
  }
}
