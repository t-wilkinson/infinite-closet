import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '@/utils/store'
import { SortBy, Filter, Filters } from './types'

// TODO: remove unecessary items
export interface State {
  data: any // TODO: can this be more abstract? in a Root state?
  pageNumber: number
  focusedFilter?: Filter
  loading: boolean
  panel: {
    open: boolean
    sortBy: SortBy
    filters: Filters
  }
  sortBy: SortBy
  filters: Partial<Filters>
}

const initialState: State = {
  data: {},
  pageNumber: 0,
  loading: false,
  panel: {
    open: false,
    sortBy: 'Newest',
    filters: {
      colors: [],
      designers: [],
      datesAvailable: [],
      occasions: [],
      favorites: [],
      weather: [],
      styles: [],
    },
  },
  sortBy: 'Newest',
  filters: {},
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
    focusFilter(state, { payload: filter }: PayloadAction<Filter>) {
      state.focusedFilter = state.focusedFilter === filter ? undefined : filter
    },
    unfocusFilter(state) {
      state.focusedFilter = undefined
    },
    dataReceived(state, { payload }) {
      // fetched data from server
      state.data = payload
    },
    setLoading(state, { payload }) {
      // fetched data from server
      state.loading = payload
    },
    setPanelFilters(state, { payload }: PayloadAction<Filters>) {
      state.panel.filters = payload
    },
    setPanelSortBy(state, { payload }: PayloadAction<SortBy>) {
      state.panel.sortBy = payload
    },
    setPanelFilter(
      state,
      {
        payload: { filter, payload },
      }: PayloadAction<{ filter: Filter; payload: string[] }>,
    ) {
      state.panel.filters[filter] = payload
    },
    setFilterState(
      state,
      {
        payload: { filter, field, payload },
      }: PayloadAction<{ filter: Filter; field: string; payload: any }>,
    ) {
      state[filter][field] = payload
    },
    togglePanel(state) {
      state.panel.open = !state.panel.open
    },
    openPanel(state) {
      state.panel.open = true
    },
    closePanel(state) {
      state.panel.open = false
    },
  },
})

const productsSelector = (state: RootState) => state.products
const panelSelector = createSelector(
  productsSelector,
  (products) => products.panel,
)
const panelSize = (
  panel: typeof initialState['panel'],
  filter: Filter,
): number => {
  return panel.filters[filter].length
}

const productsSelectors = {
  panelSelector,
  isFilterSelected: createSelector(
    [productsSelector, (_: any, filter: Filter) => filter],
    (products, filter) => products.focusedFilter === filter,
  ),
  panelFilter: createSelector(
    [panelSelector, (_: any, filter: Filter) => filter],
    (panel, filter) => panel.filters[filter],
  ),
  numToggled: createSelector([panelSelector], (filters) =>
    Object.values(Filter).reduce((acc, filter) => {
      return acc + panelSize(filters, filter)
    }, 0),
  ),
  numToggledFilter: createSelector(
    [panelSelector, (_: any, filter: Filter) => filter],
    panelSize,
  ),
}

export { productsSelectors }
export const productsActions = productsSlice.actions
export default productsSlice.reducer
