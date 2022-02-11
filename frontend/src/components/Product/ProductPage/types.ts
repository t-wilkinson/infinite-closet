export type RentType = 'OneTime' | 'Membership' | 'Purchase'
export type RentalLength = 'short' | 'long'
import { Dayjs, Size } from '@/types'

export interface AddToCartFields {
  size: Size
  selectedDate: Dayjs
  rentalLength: RentalLength
  rentType: RentType
  visible: boolean
}
