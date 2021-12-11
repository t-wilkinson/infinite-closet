export const ProductRoutes = ['clothing', 'accessories', 'new-in', 'our-picks'] as const
export type ProductRoutes = typeof ProductRoutes[number]

export const Filter = [
  'designers',
  'colors',
  'datesAvailable',
  'occasions',
  'favorites',
  'weather',
  'styles',
  'sizes',
  'materials',
  'metals',
] as const
export type Filter = typeof Filter[number]
export type Filters = { [filter in Filter]: string[] }

export const SortBy = [
  'Alphabetical',
  'Newest',
  'PriceLowHigh',
  'PriceHighLow',
] as const
export type SortBy = typeof SortBy[number]
