import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dayjs } from 'dayjs'

import { RootState } from '@/utils/store'

import { RentType, OneTime, Membership } from './types'

interface State {
  rentType: RentType
  oneTime: OneTime
  membership: Membership
  dateVisible: boolean
  selectedDate?: Dayjs
  details?: string
  size?: number
}

const initialState: State = {
  rentType: 'OneTime',
  oneTime: 'Short',
  membership: 'Short',
  dateVisible: false,
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
    changeOneTime(state, { payload }: PayloadAction<OneTime>) {
      state.oneTime = payload
    },

    changeSize(state, { payload }: PayloadAction<number>) {
      state.size = payload
    },

    selectDate(state, { payload }: PayloadAction<Dayjs>) {
      state.selectedDate = payload
    },

    showDate(state) {
      state.dateVisible = true
    },
    hideDate(state) {
      state.dateVisible = false
    },
    toggleDateVisibility(state) {
      state.dateVisible = !state.dateVisible
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