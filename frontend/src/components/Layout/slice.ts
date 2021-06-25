import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '@/utils/store'
import {
  StrapiProduct,
  StrapiDesigner,
  StrapiColor,
  StrapiOccasion,
  StrapiWeather,
  StrapiStyle,
  StrapiCategory,
  StrapiSize,
} from '@/utils/models'

import { CookieConsent } from './types'

export interface State {
  data: {
    products: StrapiProduct[]
    colors: StrapiColor[]
    occasions: StrapiOccasion[]
    weather: StrapiWeather[]
    designers: StrapiDesigner[]
    styles: StrapiStyle[]
    categories: StrapiCategory[]
    sizes: StrapiSize[]
  }
  loading: boolean
  headerOpen: boolean
  cookieConsent: CookieConsent
  analytics?: any
}

const initialState: State = {
  data: {
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
    giveConsent(
      state,
      { payload }: PayloadAction<Omit<CookieConsent, 'given'>>,
    ) {
      state.cookieConsent = { given: true, ...payload }
    },
    loadAnalytics(state, { payload }) {
      state.analytics = payload
    },
  },
})

const layoutSelector = (state: RootState) => state.layout
const layoutSelectors = {
  layoutSelector,
}

export { layoutSelectors }
export const layoutActions = layoutSlice.actions
export default layoutSlice.reducer
