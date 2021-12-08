import {StrapiSizeChart} from '@/types/models'
import {Size} from '@/Products/types'

type Mutable<T> = { -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P] };

export interface SizeChart {
  chart: StrapiSizeChart[],
  sizeEnum: Mutable<typeof Size>,
  measurements: ['hips', 'waist', 'bust'],
}
