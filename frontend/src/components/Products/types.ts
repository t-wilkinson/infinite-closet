// TODO: dynamically get these
export const ProductRoutes = ['clothing'] as const
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
] as const
export type Filter = typeof Filter[number]
export type Filters = { [filter in Filter]: string[] }

export const SortBy = [
  // 'Recommended',
  'Newest',
  'PriceLowHigh',
  'PriceHighLow',
] as const
export type SortBy = typeof SortBy[number]
