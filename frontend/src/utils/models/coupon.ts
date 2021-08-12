/**
 * Model definition for Coupon
 */
export interface StrapiCoupon {
  id: string
  type: 'percent_off' | 'amount_ff'
  amount: number
  code: string
  context?: 'checkout'
  created_by: string
  updated_at: string
  published_at: string
}

