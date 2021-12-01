import React from 'react'
import {useRouter} from 'next/router'

import Layout from '@/Layout'
import AddReview from '@/Shop/AddReview'

export const Page = () => {
  const router = useRouter()
  const slug = router.query.slug

  const onSubmit = (review) => {
    console.log(review)
    router.push('/review/thankyou')
  }

  return <Layout title="Review Your Purchases">
    <section className="max-w-screen-md w-full">
      <AddReview productSlug={slug} onSubmit={onSubmit} />
    </section>
  </Layout>
}

export default Page

