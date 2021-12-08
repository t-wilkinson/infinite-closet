import React from 'react'
import Link from 'next/link'

import axios from '@/utils/axios'
import { StrapiOrder } from '@/utils/models'

import Review, { Rating } from './Review'

type Reviews = {
  orders: StrapiOrder[]
  fit: string
  rating: number
  canReview: boolean
}

const Reviews = ({ slug }) => {
  const [data, setData] = React.useState<Reviews>()

  React.useEffect(() => {
    axios
      .get<Reviews>(`/products/${slug}/reviews`)
      .then((data) => setData(data))
      .catch((err) => console.error(err))
  }, [])

  return <ReviewsContent data={data} slug={slug} />
}

export const ReviewsContent = ({ slug, data }) => {
  if (!data) {
    return null
  }

  if (data.orders?.length === 0) {
    return data.canReview ? (
      <div className="w-full items-center py-4">
        <div className="w-full h-px bg-gray-light mb-4" />
        <AddReview productSlug={slug} />
      </div>
    ) : null
  }

  return (
    <section className="flex flex-col w-full items-center bg-pri-white">
      <div className="w-full items-center">
        <Overview {...data} />
      </div>
      {data.canReview && <AddReview productSlug={slug} />}
      <div className="max-w-screen-md w-full my-12 space-y-4">
        {data.orders.map((order: StrapiOrder) => (
          <Review key={order.id} {...order} />
        ))}
      </div>
    </section>
  )
}

const Overview = ({ fit, rating, orders }) => {
  return (
    <section
      className="flex flex-col w-full mt-8 mb-12 items-center bg-light"
      data-testid="overview"
    >
      <div className="items-center">
        <h3 className="font-bold text-2xl">Reviews</h3>
        <span className="text-base">
          {orders.length} {orders.length === 1 ? 'Review' : 'Reviews'}
        </span>
      </div>
      <div className="w-full max-w-screen-sm justify-between flex-row items-center">
        <div className="items-center space-y-2">
          <span>Rating:</span>
          <Rating rating={rating} emptyColor="text-white" />
        </div>
        <div className="space-y-2 items-center">
          <span>Fit:</span>
          <span className="font-bold text-lg">{fit}</span>
        </div>
      </div>
    </section>
  )
}

const AddReview = ({ productSlug }) => {
  return (
    <section
      data-testid="add-review"
      className="max-w-screen-md flex flex-col items-center bg-white w-full p-4"
    >
      <h3 className="text-2xl">Share your experience</h3>
      <Link href={`/review/${productSlug}`}>
        <a className="bg-pri text-white p-2 m-2 mt-4 font-bold">Add a review</a>
      </Link>
    </section>
  )
}

export default Reviews
