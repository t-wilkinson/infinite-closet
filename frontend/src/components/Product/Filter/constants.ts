import { Filter, SortBy } from './types'

type FilterData = { [key in Filter]: { label: string } }
export const filterData: FilterData = {
  wardrobes: { label: 'Wardrobes' },
  designers: { label: 'Designers' },
  colors: { label: 'Colours' },
  datesAvailable: { label: 'Dates Available' },
  occasions: { label: 'Occasions' },
  favorites: { label: 'Favorites' },
  weather: { label: 'Weather' },
  styles: { label: 'Styles' },
  sizes: { label: 'Sizes' },
  materials: { label: 'Materials' },
  metals: { label: 'Materials' },
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
