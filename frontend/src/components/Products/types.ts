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
  'Alphabetical',
  'Newest',
  'PriceLowHigh',
  'PriceHighLow',
] as const
export type SortBy = typeof SortBy[number]

export const _Size = [
  'XXS',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  '_2XL',
  '_3XL',
  '_4XL',
  '_5XL',
  '_6XL',
] as const
export type _Size = typeof _Size[number]

export const Size = [
  'XXS',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  '2XL',
  '3XL',
  '4XL',
  '5XL',
  '6XL',
] as const
export type Size = typeof Size[number]
