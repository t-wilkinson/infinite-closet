import { Filter, SortBy, ProductRoutes } from './types'
export * from './Filter/constants'

export const QUERY_LIMIT = 2 * 3 * 4 // 2 or 3 columns

export const filterNames = [
  'categories',
  'colors',
  'designer',
  'fits',
  'materials',
  'metals',
  'occasions',
  'styles',
  'weather',
] as const

export const filtersByRoute: { readonly [key in ProductRoutes]: Filter[] } = {
  all: ['designers', 'sizes', 'colors', 'occasions', 'weather', 'materials'],
  clothing: ['designers', 'sizes', 'colors', 'occasions', 'weather'],
  accessories: ['designers', 'colors', 'occasions', 'materials'],
}

