import { Order } from '@/Order'

export type CartItem = {
  valid: boolean
  totalPrice: number
  insurancePrice: number
  shippingPrice: number
  productPrice: number
  available: number
  order: Order
}
export type CartItems = CartItem[]

export type PreviewCart = {
  toggleInsurance: (id: string) => void
  remove: (order: any) => void
  cart: CartItems
}
