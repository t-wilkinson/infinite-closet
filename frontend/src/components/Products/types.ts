// TODO: dynamicall get these
export const ProductRoutes = ['clothing'] as const
export type ProductRoutes = typeof ProductRoutes[number]

export const FilterFields = ['colors', 'fits', 'occasions', 'styles'] as const
export type FilterFields = typeof FilterFields[number]

export const Filter = [
  'Designers',
  'Colors',
  'DatesAvailable',
  'Occasions',
  'Favorites',
  'Weather',
  'Style',
] as const
export type Filter = typeof Filter[number]
export type Filters = { [filter in Filter]: string[] }

export const SortBy = [
  'Recommended',
  'Newest',
  'PriceLowHigh',
  'PriceHighLow',
] as const
export type SortBy = typeof SortBy[number]
