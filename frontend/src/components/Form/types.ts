// TODO: better types
import { StrapiCoupon } from '@/utils/models'
export type Field = {
  field: string
  label: string
  type: string
  value: any
  constraints: string
  onChange: (value: any) => void
  placeholder: string
  default: string
}

export type Fields = {
  [field: string]: Field
}

export type FieldsConfig = {
  [field: string]: {
    default?: any
    constraints?: string
    label?: string
    onChange?: (value: string) => void
    type?: string
    placeholder?: string
  }
}

export type Valid = true | string

export type Coupon = {
  valid: boolean
  coupon: StrapiCoupon
  price: number
}
