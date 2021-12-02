import React from 'react'

import Layout from '@/Layout'
import AddReview from '@/Shop/AddReview'

export const Page = () => {
  return <Layout title="Review Your Purchases">
    <section className="max-w-screen-lg w-full">
      <AddReview />
    </section>
  </Layout>
}

export default Page

