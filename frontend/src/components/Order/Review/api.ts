import axios from '@/utils/axios'

import { StrapiProduct } from '@/types/models'
import { ReviewsData } from './types'

export const getReviews = ({slug, onSuccess}) =>
    axios
      .get<ReviewsData>(`/products/${slug}/reviews`)
      .then((reviews) => onSuccess(reviews))
      .catch((err) => console.error(err))

export const getCanReview = ({productSlug, setCanReview, setProduct}) =>
    axios
      .get<{canReview: boolean; product: StrapiProduct}>(`/products/${productSlug}/reviews/can-review`)
      .then((data) => {
        setCanReview(data.canReview)
        setProduct(data.product)
      })
      .catch(() => setCanReview(false))
