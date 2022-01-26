import { Summary } from '@/types'
import { StrapiOrder } from '@/types/models'

export interface State {
  orderHistory?: Cart
  checkoutSummary?: Summary
  checkoutCart?: Cart
  count?: number
  favorites?: Orders
}

export type Orders = StrapiOrder[]
export type Cart = CartItem[]

export type CartItem = {
  valid: boolean
  totalPrice: number
  insurancePrice: number
  shippingPrice: number
  productPrice: number
  available: number
  order: StrapiOrder
}

export type PreviewCart = {
  toggleInsurance: (id: string) => void
  remove: (order: any) => void
  cart: Cart
}

export type Order = StrapiOrder
