
export const Filter = [
  'wardrobes',
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
export type FilterData = { [filter in Filter]: string[] }

export const SortBy = [
  'Alphabetical',
  'Newest',
  'PriceLowHigh',
  'PriceHighLow',
] as const
export type SortBy = typeof SortBy[number]
