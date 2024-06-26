import { Size } from '@/types'
import { StrapiSizeChart } from '@/types/models'

type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? U[] : T[P]
}

export interface SizeChart {
  chart: StrapiSizeChart[]
  sizeEnum: Mutable<typeof Size>
  measurements: ['hips', 'waist', 'bust']
}
