import {StrapiCoupon} from '@/types/models'

export interface Summary {
    preDiscount: number,
    subtotal: number,
    shipping: number,
    insurance: number,
    discount: number,
    coupon: StrapiCoupon,
    total: number,
    amount: number,
}
