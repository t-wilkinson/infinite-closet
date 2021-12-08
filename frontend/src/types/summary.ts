import {StrapiCoupon} from '@/utils/models'

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
