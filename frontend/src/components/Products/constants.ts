import { Filter, SortBy, ProductRoutes } from './types'

export const QUERY_LIMIT = 2 * 3 * 4 // 2 or 3 columns

type FilterData = { [key in Filter]: { label: string } }
export const filterData: FilterData = {
  designers: { label: 'Designers' },
  colors: { label: 'Colours' },
  datesAvailable: { label: 'Dates Available' },
  occasions: { label: 'Occasions' },
  favorites: { label: 'Favorites' },
  weather: { label: 'Weather' },
  styles: { label: 'Styles' },
  sizes: { label: 'Sizes' },
}

export const sortData: {
  [sortBy in SortBy]: { name: string; value: string }
} = {
  Alphabetical: {
    name: 'Alphabetical',
    value: 'name:ASC',
  },
  Newest: { name: 'Newest', value: 'created_by:ASC' },
  PriceLowHigh: {
    name: 'Price (Low to High)',
    value: 'shortRentalPrice:ASC',
  },
  PriceHighLow: {
    name: 'Price (High to Low)',
    value: 'shortRentalPrice:DESC',
  },
} as const

export const filtersByRoute: { readonly [key in ProductRoutes]: Filter[] } = {
  clothing: ['designers', 'colors', 'occasions', 'weather', 'sizes'],
  accessories: ['designers', 'colors'],
}
