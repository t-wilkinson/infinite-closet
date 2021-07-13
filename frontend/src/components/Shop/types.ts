export type RentType = 'OneTime' | 'Membership' | 'Purchase'
export type OneTime = 'short' | 'long'
export type Membership = 'Short' | 'Medium' | 'Large'
export interface State {
  moreInfo?: String
  rentType: RentType
  oneTime: OneTime
  membership: Membership
  size?: string
}
