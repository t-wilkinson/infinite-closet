import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '@/utils/store'

export interface State {
  data: object
  loading: boolean
  headerOpen: boolean
}

const initialState = {
  data: {},
  loading: false,
  headerOpen: false,
}

export const layoutSlice = createSlice({
  name: 'LAYOUT',
  initialState,
  reducers: {
    dataReceived(state, { payload }: PayloadAction<object>) {
      state.data = { ...state.data, ...payload }
    },
    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload
    },
    startLoading(state) {
      state.loading = true
    },
    doneLoading(state) {
      state.loading = false
    },

    toggleHeader(state) {
      state.headerOpen = !state.headerOpen
    },
    openHeader(state) {
      state.headerOpen = true
    },
    closeHeader(state) {
      state.headerOpen = false
    },
  },
})

const layoutSelector = (state: RootState) => state.layout

const layoutSelectors = {
  data: createSelector([layoutSelector], (layout) => layout.data),
  loading: createSelector([layoutSelector], (layout) => layout.loading),
}

export { layoutSelectors }
export const layoutActions = layoutSlice.actions
export default layoutSlice.reducer
