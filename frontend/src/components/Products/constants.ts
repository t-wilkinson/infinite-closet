import { Filter, SortBy, ProductRoutes } from './types'

export const QUERY_LIMIT = 2 * 3 * 2 // 2 or 3 columns

// TODO: remove this
export type FilterData = typeof filterData
export const filterData = {
  Weather: {
    filterName: 'weather',
    data: [
      { slug: 'cold_weather', name: 'Cold Weather' },
      { slug: 'warm_weather', name: 'Warm Weather' },
      { slug: 'year_round', name: 'Year-Round' },
    ],
  },
  Occasions: {
    filterName: 'occasions',
    data: [
      { name: 'Wedding', slug: 'Wedding' },
      { name: 'Date Night', slug: 'Date Night' },
      { name: 'Party', slug: 'Party' },
      { name: 'Brunch', slug: 'Brunch' },
      { name: 'Office', slug: 'Office' },
      { name: 'Cocktail', slug: 'Cocktail' },
    ],
  },
  Colors: {
    filterName: 'colors',
    data: [
      { color: 'white', name: 'White', value: '#ffffff' },
      { color: 'gray', name: 'Gray', value: '#cccccc' },
      { color: 'black', name: 'Black', value: '#000000' },

      { color: 'red', name: 'Red', value: '#ff0000' },
      { color: 'blue', name: 'Blue', value: '#4169E1' },
      { color: 'green', name: 'Green', value: '#00ff00' },
      { color: 'pink', name: 'Pink', value: '#FFC0CB' },
      { color: 'orange', name: 'Orange', value: '#FFA500' },

      { color: 'emerald', name: 'Emerald', value: '#50C878' },
      { color: 'champagne', name: 'Champagne', value: '#F7E7CE' },
    ],
  },
  Style: {
    filterName: 'styles',
    data: [
      { slug: 'apple', name: 'Apple' },
      { slug: 'athletic', name: 'Athletic' },
      { slug: 'bump_friendly', name: 'Bump Friendly' },
      { slug: 'full_bust', name: 'Full Bust' },
      { slug: 'hourglass', name: 'Hourglass' },
      { slug: 'pear', name: 'Pear' },
      { slug: 'petite', name: 'Petite' },
      { slug: 'straight_narrow', name: 'Straight & Narrow' },
    ],
  },
  DatesAvailable: {
    filterName: undefined,
    name: 'Dates Available',
  },
  Designers: {
    filterName: 'designer',
  },
  Favorites: { filterName: undefined },
} as const

export const sortData: {
  [sortBy in SortBy]: { name: string; value: string }
} = {
  Recommended: { name: 'Recommended', value: 'created_by' },
  Newest: { name: 'Newest', value: 'created_by' },
  PriceLowHigh: {
    name: 'Price (Low to High)',
    value: 'shortRentalPrice:ASC',
  },
  PriceHighLow: {
    name: 'Price (High to Low)',
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
