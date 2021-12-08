import { StrapiCoupon } from '@/types/models'
import {UseField} from './fields'
export {UseField, UseFields} from './fields'

export type FieldConfig<Value=FieldValue> = Partial<{
  default: any
  constraints: string
  label: string
  onChange: (value: Value) => void
  type: string
  placeholder: string
  autocomplete: string
  errorMessage: string    // Provide custom error messages
  changed: (field: UseField<Value>) => [boolean, Value?]
}>

export type FieldsConfig<Keys=any> = {
  [field in keyof Keys]: FieldConfig<Keys[field]>
}

export type FieldErrors = { [field: string]: FieldError[] }
export type FieldError = string
export type Valid = true | string

export type UseFormField = UseField<'success' | 'submitting' | 'error' | null>

export type Coupon = {
  valid: boolean
  coupon: StrapiCoupon
  price: number
  discount: number
}

export type FieldValue = number | string | boolean

export type DateOfBirthFields = {
  bday: UseField<FieldValue>
  bmonth: UseField<FieldValue>
  byear: UseField<FieldValue>
}
