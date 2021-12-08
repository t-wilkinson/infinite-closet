export type RentType = 'OneTime' | 'Membership' | 'Purchase'
export type RentalLength = 'short' | 'long'
export type Membership = 'Short' | 'Medium' | 'Large'
export interface State {
  moreInfo?: String
  rentType: RentType
  membership: Membership
  size?: string
}
