import { StrapiUser, StrapiOrder } from '@/types/models'
import { Summary } from '@/types'
import axios from '@/utils/axios'
import { Orders, getGuestOrders } from '@/Order'

import { CartItems } from './types'

export async function cartSummary(user: StrapiUser): Promise<Summary> {
  const orders = await getCart(user)
  if (user) {
    return await axios
      .post<Summary>(`/orders/cart/summary`, { orders })
      .catch(() => undefined)
  } else {
    return await axios
      .post(`/orders/cart/summary`, { orders }, { withCredentials: false })
      .catch(() => undefined)
  }
}

export function getGuestCart(): Orders {
  const orders = getGuestOrders()
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

export async function viewCart(user: StrapiUser): Promise<CartItems> {
  if (user) {
    return await axios.get(`/orders/cart/view/${user.id}`)
  } else {
    const orders = getGuestCart()
    return await axios.post(
      `/orders/cart/view`,
      { orders },
      { withCredentials: false }
    )
  }
}
