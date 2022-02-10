import * as storage from '@/utils/storage'
import axios from '@/utils/axios'
import { StrapiUser, StrapiOrder } from '@/types/models'

import { Cart, Orders } from './types'

function getStorageOrders() {
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

export const getGuestOrders = getStorageOrders

export function getGuestCart(): Orders {
  const orders = getStorageOrders()
  return orders.filter((order: StrapiOrder) => order.status === 'cart')
}

export async function getUserCart(user: StrapiUser): Promise<Orders> {
  return await axios.get(`/orders/cart/${user.id}`)
}

export function getCart(user: StrapiUser) {
  if (user) {
    return getUserCart(user)
  } else {
    return getGuestCart()
  }
}

async function getUserFavorites(user: StrapiUser): Promise<Orders> {
  const orders = await axios.get(`/orders/favorites/${user.id}`)
  return orders
}

function getGuestFavorites(): Orders {
  const orders = getStorageOrders()
  return orders.filter((order: StrapiOrder) => order.status === 'list')
}

export async function getFavorites(user: StrapiUser): Promise<Orders> {
  if (user) {
    return getUserFavorites(user)
  } else {
    return getGuestFavorites()
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

export async function viewCart(user: StrapiUser): Promise<Cart> {
  if (user) {
    return await axios.get(`/orders/cart/view/${user.id}`)
  } else {
    const orders = getGuestCart()
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
