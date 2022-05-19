export const ProductRoutes = ['clothing', 'accessories', 'new-in', 'our-picks'] as const
export type ProductRoutes = typeof ProductRoutes[number]

export * from './Filter/types'
