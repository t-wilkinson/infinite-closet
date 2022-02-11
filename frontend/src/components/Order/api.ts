import * as storage from '@/utils/storage'
import axios from '@/utils/axios'
import { StrapiUser } from '@/types/models'

import { Order, Orders, CartItems } from './types'

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

  return orders.filter((order: Order) => !order.user)
}

export const getGuestOrders = getStorageOrders

export async function orderHistory(user: StrapiUser): Promise<CartItems> {
  return user ? axios.get(`/orders/cart/history/${user.id}`) : Promise.resolve([])
}

export async function updateUserOrder(order: Partial<Order>) {
  return await axios.put<void>(`/orders/${order.id}`, order)
}

export async function updateGuestOrder(order: Partial<Order>) {
  return await axios.put<void>(`/orders/${order.id}`, order, {
    withCredentials: false,
  })
}

export async function updateOrder(user: StrapiUser, order: Partial<Order>) {
  return user ? updateUserOrder(order) : updateGuestOrder(order)
}

export const createUserOrder = async (order: Partial<Order>) => axios.post<void>('/orders', order)
export const createGuestOrder = async (order: Partial<Order>) => axios.post<Order>('/orders', order, {
  withCredentials: false
})
export const createOrder = async (user: StrapiUser, order: Partial<Order>) => user ? createUserOrder(order) : createGuestOrder(order)

export const countUserOrders = async () => axios.get<number>('/orders/cart/count')
