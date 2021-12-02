import React from 'react'
import {useRouter} from 'next/router'

import Layout from '@/Layout'
import AddReview from '@/Shop/AddReview'

export const Page = () => {
  const router = useRouter()
  const slug = router.query.slug

  return <Layout title="Review Your Purchases">
    <section className="max-w-screen-lg w-full">
      <AddReview productSlug={slug} onSubmit={(review) => router.push('/review/thankyou')} />
    </section>
  </Layout>
}

export default Page

