import React from 'react'

import { div, span, button } from '@/shared/components'

import { State } from './types'

export const ProductRentHeaders = ({
  shopItem,
  membership_price,
  state,
  setState,
}) => {
  return (
    <div
      flexDirection="row"
      borderColor="gray3"
      borderWidth={1}
      borderRadius={4}
      bg="light-gray"
    >
      {Object.keys(productRentHeaders).map((rentType, i) => {
        return (
          <button
            key={rentType}
            style={{ flex: 1 }}
            onPress={() =>
              setState((s: State) => ({
                ...s,
                rentType,
              }))
            }
          >
            <div
              flex={1}
              p="sm"
              borderRightColor="gray3"
              borderRightWidth={
                i !== Object.keys(productRentHeaders).length - 1 ? 1 : 0
              }
              {...(Number(rentType) === state.rentType && { bg: 'sec' })}
            >
              <div flex={1} alignItems="center" justifyContent="space-between">
                {productRentHeaders[rentType]({
                  shopItem,
                  membership_price,
                  state,
                  setState,
                })}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
export default ProductRentHeaders

const productRentHeaders = {
  OneTime: ({ shopItem }) => (
    <>
      <span fontSize={13} variant="body-bold" textAlign="center">
        One-time rental
      </span>
      <span variant="body-bold">£{shopItem.rental_price}</span>
    </>
  ),

  Membership: ({ membership_price }) => (
    <>
      <span fontSize={13} variant="body-bold">
        Membership
      </span>
      {/* <span variant="body-bold">from £{membership_price}</span> */}
    </>
  ),

  Purchase: ({ shopItem }) => (
    <>
      <span fontSize={13} variant="body-bold">
        Purchase
      </span>
      {/* <span variant="body-bold">£{shopItem.purchase_price}</span> */}
    </>
  ),
}
