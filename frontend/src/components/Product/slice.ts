import { createSlice, createSelector, } from '@reduxjs/toolkit'

import { RootState } from '@/utils/store'
import { SortBy, Filter, FilterData } from './Filter/types'
import { initializeFilterReducer, initializeFilterState } from './Filter/slice'

export interface State {
  data: any // TODO: can this be more abstract? in a Root state?
  pageNumber: number
  focusedFilter: Set<Filter>
  loading: boolean
  panel: {
    open: boolean
    sortBy: SortBy
    filters: FilterData
  }
  sortBy: SortBy
  filters: Partial<FilterData>
}

const initialState: State = {
  data: {},
  pageNumber: 0,
  loading: false,
  ...initializeFilterState([
      'colors',
      'designers',
      'datesAvailable',
      'occasions',
      'favorites',
      'weather',
      'styles',
      'sizes',
      'materials',
      'metals',
  ]),
}

export const productsSlice = createSlice({
  name: 'PRODUCTS',
  initialState,
  reducers: {
    increasePageNumber(state, { payload: totalPages }) {
      const n = state.pageNumber
      state.pageNumber = n + 1 < totalPages ? n + 1 : n
    },
    decreasePageNumber(state) {
      const n = state.pageNumber
      state.pageNumber = n > 0 ? n - 1 : 0
    },
    dataReceived(state, { payload }) {
      // fetched data from server
      state.data = payload
    },
    setLoading(state, { payload }) {
      // fetched data from server
      state.loading = payload
    },
    ...initializeFilterReducer()
  },
})

const productsSelector = (state: RootState) => state.products
const panelSelector = createSelector(
  productsSelector,
  (products) => products.panel
)
const panelSize = (
  panel: typeof initialState['panel'],
  filter: Filter
): number => {
  return panel.filters[filter]?.length || 0
}

const productsSelectors = {
  panelSelector,
  isFilterSelected: createSelector(
    [productsSelector, (_: any, filter: Filter) => filter],
    (products, filter) => products.focusedFilter.has(filter)
  ),
  numToggled: createSelector([panelSelector], (filters) =>
    Object.values(Filter).reduce((acc, filter) => {
      return acc + panelSize(filters, filter)
    }, 0)
  ),
  numToggledFilter: createSelector(
    [panelSelector, (_: any, filter: Filter) => filter],
    panelSize
  ),
}

export { productsSelectors }
export const productsActions = productsSlice.actions
export default productsSlice.reducer
