import axios from '@/utils/axios'

import { ReviewsData } from './types'

export const getReviews = ({slug, onSuccess}) =>
    axios
      .get<ReviewsData>(`/products/${slug}/reviews`)
      .then((reviews) => onSuccess(reviews))
      .catch((err) => console.error(err))

export const getCanReview = ({productSlug, setCanReview}) =>
    axios
      .get<{canReview: boolean}>(`/products/${productSlug}/reviews/can-review`)
      .then((data) => setCanReview(data.canReview))
      .catch(() => setCanReview(false))
