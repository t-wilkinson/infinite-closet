import { StrapiOrder } from '@/types/models'

export type ReviewsData = {
  orders: StrapiOrder[]
  fit: string
  rating: number
  canReview: boolean
}

