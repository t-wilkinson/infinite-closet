import { StrapiCoupon } from '@/utils/models'
import {UseField} from './fields'
export {UseField, UseFields} from './fields'
// export type Field = {
//   field: string
//   label: string
//   type: string
//   value: any
//   constraints: string
//   onChange: (value: any) => void
//   placeholder: string
//   default: string
//   errors: FieldError[]
//   setErrors: (value: FieldError[]) => void
// }

// export type Fields = {
//   [field: string]: Field
// }

export type FieldConfig = Partial<{
  default: any
  constraints: string
  label: string
  onChange: (value: string) => void
  type: string
  placeholder: string
  autocomplete: string
}>

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

export type DateOfBirthFields = {
  bday: UseField<number>
  bmonth: UseField<number>
  byear: UseField<number>
}
