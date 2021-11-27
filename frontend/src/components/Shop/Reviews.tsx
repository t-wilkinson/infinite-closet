import React from 'react'
import axios from 'axios'

import Review from './Review'

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
    <div className="w-full items-center">
      <Overview {...data} />
      <div className="max-w-screen-md w-full mt-4 space-x-4">
        {data.reviews.map((review) => (
          <Review key={review.id} {...review} />
        ))}
      </div>
    </div>
  )
}

const Overview = ({ fit, rating, reviews }) => {
  return (
    <div className="w-full bg-sec-light h-32 p-8">
      <div>reviews={reviews.length}</div>
      <div>fit={fit}</div>
      <div>rating={rating}</div>
    </div>
  )
}

export default Reviews
