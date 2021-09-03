import { StrapiOrder } from '@/utils/models'

export interface State {
  checkoutSummary?: object
  checkoutCart?: CheckoutCart
  count?: number
}

export type Cart = StrapiOrder[]
export type CheckoutCart = CheckoutItem[]

export type CheckoutItem = {
  valid: boolean
  price: number
  available: number
} & StrapiOrder

export type PreviewCart = {
  toggleInsurance: (id: string) => void
  remove: (order: any) => void
  cart: CheckoutItem[]
  insurance: { [key: string]: boolean }
}
