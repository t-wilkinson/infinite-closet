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
  errors: FieldError[]
  setErrors: (value: FieldError[]) => void
}

export type Fields = {
  [field: string]: Field
}

export type FieldConfig = {
  default?: any
  constraints?: string
  label?: string
  onChange?: (value: string) => void
  type?: string
  placeholder?: string
}

export type FieldsConfig = {
  [field: string]: FieldConfig
}

export type FieldErrors = { [field: string]: FieldError[] }
export type FieldError = string
export type Valid = true | string

export type Coupon = {
  valid: boolean
  coupon: StrapiCoupon
  price: number
}

export type DateOfBirthField = { day: Field; month: Field; year: Field }
