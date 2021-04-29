import { Filter, SortBy, ProductRoutes } from './types'

export const QUERY_LIMIT = 6
export const FILTERS_ASIDE_WIDTH = 200

// TODO: dynamically get this
export type FilterData = typeof filterData
export const filterData = {
  Weather: {
    filterName: 'weathers',
    data: [
      { field: 'cold_weather', label: 'Cold Weather' },
      { field: 'warm_weather', label: 'Warm Weather' },
      { field: 'year_round', label: 'Year-Round' },
    ],
  },
  Occasions: {
    filterName: 'occasions',
    data: [
      { field: 'date', label: 'Date' },
      { field: 'formal_affair', label: 'Formal Affair' },
      { field: 'party', label: 'Party' },
      { field: 'vacation', label: 'Vacation' },
      { field: 'wedding', label: 'Wedding' },
      { field: 'weekend', label: 'Weekend' },
      { field: 'work', label: 'Work' },
    ],
  },
  Colors: {
    filterName: 'colors',
    data: [
      { color: 'white', label: 'White', value: '#ffffff' },
      { color: 'gray', label: 'Gray', value: '#cccccc' },
      { color: 'black', label: 'Black', value: '#000000' },
      { color: 'red', label: 'Red', value: '#ff0000' },
      { color: 'blue', label: 'Blue', value: '#0000ff' },
      { color: 'green', label: 'Green', value: '#00ff00' },
    ],
  },
  Style: {
    filterName: 'styles',
    data: [
      { field: 'apple', label: 'Apple' },
      { field: 'athletic', label: 'Athletic' },
      { field: 'bump_friendly', label: 'Bump Friendly' },
      { field: 'full_bust', label: 'Full Bust' },
      { field: 'hourglass', label: 'Hourglass' },
      { field: 'pear', label: 'Pear' },
      { field: 'petite', label: 'Petite' },
      { field: 'straight_narrow', label: 'Straight & Narrow' },
    ],
  },
  DatesAvailable: {
    filterName: undefined,
    label: 'Dates Available',
  },
  Designers: {
    filterName: 'designers',
  },
  Favorites: { filterName: undefined },
} as const

export const sortData: {
  [sortBy in SortBy]: { label: string; value: string }
} = {
  Recommended: { label: 'Recommended', value: 'created_by' },
  Newest: { label: 'Newest', value: 'created_by' },
  PriceLowHigh: {
    label: 'Price (Low to High)',
    value: 'rental_price:ASC',
  },
  PriceHighLow: {
    label: 'Price (High to Low)',
    value: 'rental_price:DESC',
  },
} as const

// TODO: dynamically get these
export const filtersByRoute: { readonly [key in ProductRoutes]: Filter[] } = {
  clothing: [
    'Designers',
    'Colors',
    'DatesAvailable',
    'Occasions',
    'Favorites',
    'Weather',
    'Style',
  ],
}
