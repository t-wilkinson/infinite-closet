import { Summary } from '@/types'
import { StrapiCheckout, StrapiPurchase, StrapiOrder } from '@/types/models'
import { CartItems } from './Cart'
export * from './Cart/types'

export type Orders = StrapiOrder[]
export type Order = StrapiOrder

export interface Checkout {
  orders: CartItems
  purchase: StrapiPurchase
}

export type CheckoutHistory = Checkout[]

export interface State {
  checkoutHistory?: CheckoutHistory
  checkoutSummary?: Summary
  checkoutCart?: CartItems
  count?: number
  favorites?: Orders
}
