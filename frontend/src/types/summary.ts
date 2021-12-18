import { StrapiGiftCard, StrapiCoupon } from '@/types/models'

export interface Summary {
  valid: boolean
  preDiscount: number
  subtotal: number
  shipping: number
  insurance: number
  discount: number
  coupon: StrapiCoupon
  giftCard: StrapiGiftCard
  total: number
  amount: number
}
