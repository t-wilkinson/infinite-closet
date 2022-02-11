import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface State {
  dateVisible: boolean
  details?: string
}

const initialState: State = {
  dateVisible: false,
  details: 'details',
}

export const shopSlice = createSlice({
  name: 'SHOP',
  initialState,
  reducers: {
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

export const shopActions = shopSlice.actions
export default shopSlice.reducer
