import React from 'react'
import { useRouter } from 'next/router'

import Layout from '@/Layout'
import { AddReview } from '@/Order/Review'

export const Page = () => {
  const router = useRouter()
  const productSlug = router.query.slug

  return <Layout title="Review Your Purchases">
    <section className="max-w-screen-lg w-full">
      <AddReview productSlug={productSlug} />
    </section>
  </Layout>
}

export default Page
