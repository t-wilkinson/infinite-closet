import { Summary } from '@/types'
import { StrapiOrder } from '@/types/models'
import { CartItems } from './Cart'
export * from './Cart/types'

export type Orders = StrapiOrder[]
export type Order = StrapiOrder

export interface Checkout{
  orders: CartItems
}

export type CheckoutHistory = Checkout[]

export interface State {
  checkoutHistory?: CheckoutHistory
  checkoutSummary?: Summary
  checkoutCart?: CartItems
  count?: number
  favorites?: Orders
}
