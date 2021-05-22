import { Filter, SortBy, ProductRoutes } from './types'

export const QUERY_LIMIT = 6

// TODO: the field probably isnt necessary
// TODO: dynamically get this
export type FilterData = typeof filterData
export const filterData = {
  Weather: {
    filterName: 'weather',
    data: [
      { field: 'cold_weather', label: 'Cold Weather' },
      { field: 'warm_weather', label: 'Warm Weather' },
      { field: 'year_round', label: 'Year-Round' },
    ],
  },
  Occasions: {
    filterName: 'occasions',
    data: [
      { label: 'Wedding', field: 'Wedding' },
      { label: 'Date Night', field: 'Date Night' },
      { label: 'Party', field: 'Party' },
      { label: 'Brunch', field: 'Brunch' },
      { label: 'Office', field: 'Office' },
      { label: 'Cocktail', field: 'Cocktail' },
    ],
  },
  Colors: {
    filterName: 'colors',
    data: [
      { color: 'white', label: 'White', value: '#ffffff' },
      { color: 'gray', label: 'Gray', value: '#cccccc' },
      { color: 'black', label: 'Black', value: '#000000' },

      { color: 'red', label: 'Red', value: '#ff0000' },
      { color: 'blue', label: 'Blue', value: '#4169E1' },
      { color: 'green', label: 'Green', value: '#00ff00' },
      { color: 'pink', label: 'Pink', value: '#FFC0CB' },
      { color: 'orange', label: 'Orange', value: '#FFA500' },

      { color: 'emerald', label: 'Emerald', value: '#50C878' },
      { color: 'champagne', label: 'Champagne', value: '#F7E7CE' },
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
    filterName: 'designer.slug',
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
    value: 'shortRentalPrice:ASC',
  },
  PriceHighLow: {
    label: 'Price (High to Low)',
    value: 'shortRentalPrice:DESC',
  },
} as const

// TODO: dynamically get these
export const filtersByRoute: { readonly [key in ProductRoutes]: Filter[] } = {
  clothing: [
    'Designers',
    'Colors',
    // 'DatesAvailable',
    'Occasions',
    // 'Favorites',
    'Weather',
    // 'Style',
  ],
}
