import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '@/utils/store'

import { RentType, Membership } from './types'

export interface State {
  rentType: RentType
  membership: Membership
  dateVisible: boolean
  details?: string
}

const initialState: State = {
  rentType: 'OneTime',
  membership: 'Short',
  dateVisible: false,
  details: 'details',
}

export const shopSlice = createSlice({
  name: 'SHOP',
  initialState,
  reducers: {
    changeRentType(state, { payload }: PayloadAction<RentType>) {
      state.rentType = payload
    },
    changeMembership(state, { payload }: PayloadAction<Membership>) {
      state.membership = payload
    },

    setDateVisibility(state, { payload }: PayloadAction<boolean>) {
      state.dateVisible = payload
    },
    showDate(state) {
      state.dateVisible = true
    },
    hideDate(state) {
      state.dateVisible = false
    },

    toggleDetails(state, { payload }: PayloadAction<string>) {
      state.details = payload === state.details ? undefined : payload
    },
    showDetails(state, { payload }: PayloadAction<string>) {
      state.details = payload
    },
    hideDetails(state) {
      state.details = undefined
    },
  },
})

const shopSelector = (state: RootState) => state.shop

const shopSelectors = {
  shop: shopSelector,
}

export { shopSelectors }
export const shopActions = shopSlice.actions
export default shopSlice.reducer
