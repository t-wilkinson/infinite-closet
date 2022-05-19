import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '@/utils/store'
import { SortBy, Filter, FilterData } from '@/Product/Filter'
import {
  initializeFilterReducer,
  initializeFilterState,
} from '@/Product/Filter/slice'

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
    'wardrobes',
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

export const wardrobeSlice = createSlice({
  name: 'WARDROBE',
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
    ...initializeFilterReducer(),
  },
})

const wardrobeSelector = (state: RootState) => state.wardrobe
const panelSelector = createSelector(
  wardrobeSelector,
  (wardrobe) => wardrobe.panel
)
const panelSize = (
  panel: typeof initialState['panel'],
  filter: Filter
): number => {
  return panel.filters[filter]?.length || 0
}

const wardrobeSelectors = {
  panelSelector,
  isFilterSelected: createSelector(
    [wardrobeSelector, (_: any, filter: Filter) => filter],
    (wardrobe, filter) => wardrobe.focusedFilter.has(filter)
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

export { wardrobeSelectors }
export const wardrobeActions = wardrobeSlice.actions
export default wardrobeSlice.reducer
