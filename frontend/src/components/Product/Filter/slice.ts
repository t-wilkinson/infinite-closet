import { PayloadAction } from '@reduxjs/toolkit'
import { SortBy, Filter, Filters } from './types'

// TODO: This can probably be its own slice
// (as opposed to exporting functions for other slices)

export interface State {
  focusedFilter: Set<Filter>
  panel: {
    open: boolean
    sortBy: SortBy
    filters: Filters
  }
  sortBy: SortBy
  filters: Partial<Filters>
}

export function initializeFilterState(filters: Filter[]): State {
  return {
    panel: {
      open: false,
      sortBy: 'Alphabetical',
      filters: Object.fromEntries(filters.map(filter => [filter, []])) as Filters,
    },
    sortBy: 'Alphabetical',
    filters: {},
    focusedFilter: new Set(['designers', 'sizes'] as const),
  }
}

export function initializeFilterReducer() {
  return {
    toggleFilter(state, { payload: filter }: PayloadAction<Filter>) {
      if (state.focusedFilter.has(filter)) {
        state.focusedFilter.delete(filter)
      } else {
        state.focusedFilter.add(filter)
      }
    },
    unfocusFilter(state, { payload: filter }: PayloadAction<Filter>) {
      state.focusedFilter.delete(filter)
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
      }: PayloadAction<{ filter: Filter; payload: string[] }>
    ) {
      state.panel.filters[filter] = payload
    },
    setFilterState(
      state,
      {
        payload: { filter, field, payload },
      }: PayloadAction<{ filter: Filter; field: string; payload: any }>
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

  }
}
