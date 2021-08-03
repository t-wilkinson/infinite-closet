import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '@/utils/store'
import {
  StrapiProduct,
  StrapiDesigner,
  StrapiColor,
  StrapiOccasion,
  StrapiWeather,
  StrapiStyle,
  StrapiCategory,
} from '@/utils/models'
import { Size } from '@/Products/types'

import { CookieConsent } from './types'

export interface State {
  data: {
    product: StrapiProduct
    products: StrapiProduct[]
    colors: StrapiColor[]
    occasions: StrapiOccasion[]
    weather: StrapiWeather[]
    designers: StrapiDesigner[]
    styles: StrapiStyle[]
    categories: StrapiCategory[]
    sizes: Size[]
  }
  loading: boolean
  headerOpen: boolean
  cookieConsent: CookieConsent
  firebase?: any
}

const initialState: State = {
  data: {
    product: undefined,
    categories: [],
    products: [],
    designers: [],
    colors: [],
    occasions: [],
    weather: [],
    styles: [],
    sizes: [],
  },
  loading: false,
  headerOpen: false,
  cookieConsent: {
    given: null,
    statistics: false,
  },
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
    clearConsent(state) {
      state.cookieConsent = { ...initialState.cookieConsent, given: false }
    },
    giveConsent(state, { payload }: PayloadAction<Partial<CookieConsent>>) {
      if (payload.given === null) {
        Object.assign(state.cookieConsent, payload, { given: false })
      } else {
        Object.assign(state.cookieConsent, { given: true }, payload)
      }
    },
    loadFirebase(state, { payload }) {
      state.firebase = payload
    },
  },
})

const layoutSelector = (state: RootState) => state.layout
const layoutSelectors = {
  layoutSelector,
  consent: createSelector([layoutSelector], (layout) => layout.cookieConsent),
}

export { layoutSelectors }
export const layoutActions = layoutSlice.actions
export default layoutSlice.reducer
