import { StrapiUser, StrapiOrder } from '@/types/models'
import { Orders, getGuestOrders } from '@/Order'
import axios from '@/utils/axios'

async function getUserFavorites(user: StrapiUser): Promise<Orders> {
  const orders = await axios.get(`/orders/favorites/${user.id}`)
  return orders
}

function getGuestFavorites(): Orders {
  const orders = getGuestOrders()
  return orders.filter((order: StrapiOrder) => order.status === 'list')
}

export async function getFavorites(user: StrapiUser): Promise<Orders> {
  if (user) {
    return getUserFavorites(user)
  } else {
    return getGuestFavorites()
  }
}
