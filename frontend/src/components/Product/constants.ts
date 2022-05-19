import { Filter, SortBy, ProductRoutes } from './types'
export * from './Filter/constants'

export const QUERY_LIMIT = 2 * 3 * 4 // 2 or 3 columns

export const filtersByRoute: { readonly [key in ProductRoutes]: Filter[] } = {
  clothing: ['designers', 'sizes', 'colors', 'occasions', 'weather'],
  accessories: ['designers', 'colors', 'occasions', 'materials'],
}

