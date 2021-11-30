import React from 'react'
import axios from 'axios'

import Review, { Rating } from './Review'

const Reviews = ({ slug }) => {
  const [data, setData] =
    React.useState<{ reviews: any[]; fit: string; rating: number }>()

  React.useEffect(() => {
    axios
      .get(`/products/${slug}/reviews`)
      .then((res) => res.data)
      .then((data) => setData(data))
      .catch((err) => console.error(err))
  }, [])

  if (!data) {
    return null
  }

  return (
    <section className="flex flex-col w-full items-center bg-pri-white">
      <div className="w-full items-center">
        <Overview {...data} />
      </div>
      <div className="max-w-screen-md w-full my-12 space-x-4">
        {data.reviews.map((review) => (
          <Review key={review.id} {...review} />
        ))}
      </div>
    </section>
  )
}

const Overview = ({ fit, rating, reviews }) => {
  return (
    <div className="w-full mt-8 mb-12 items-center">
      <div className="items-center">
        <h3 className="font-bold text-2xl">Reviews</h3>
        <span className="text-base">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </span>
      </div>
      <div className="w-full max-w-screen-sm justify-between flex-row items-center">
        <div className="items-center space-y-2">
          <span>Rating:</span>
          <Rating rating={rating} />
        </div>
        <div className="space-y-2 items-center">
          <span>Fit:</span>
          <span className="font-bold text-lg">{fit}</span>
        </div>
      </div>
    </div>
  )
}

export default Reviews
