import { StrapiOrder } from '@/utils/models'

export interface State {
  checkoutSummary?: any
  checkoutCart?: Cart
  ordersStatus?: StrapiOrder[]
  count?: number
}

export type Orders = StrapiOrder[]
export type Cart = CartItem[]

export type CartItem = {
  valid: boolean
  price: number
  available: number
  order: StrapiOrder
}

export type PreviewCart = {
  toggleInsurance: (id: string) => void
  remove: (order: any) => void
  cart: Cart
}

export type Order = StrapiOrder
