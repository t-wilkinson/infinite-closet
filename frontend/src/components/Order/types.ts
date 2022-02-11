import { Summary } from '@/types'
import { StrapiOrder } from '@/types/models'
import { CartItems } from './Cart'
export * from './Cart/types'

export type Orders = StrapiOrder[]
export type Order = StrapiOrder

export interface State {
  orderHistory?: CartItems
  checkoutSummary?: Summary
  checkoutCart?: CartItems
  count?: number
  favorites?: Orders
}
