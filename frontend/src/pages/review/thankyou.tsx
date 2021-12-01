import React from 'react'
import {useRouter} from 'next/router'

import Layout from '@/Layout'
import AddReview from '@/Shop/AddReview'

export const Page = () => {
  const router = useRouter()
  const slug = router.query.slug

  return <Layout title="Review Your Purchases">
    <section className="max-w-screen-md w-full items-center flex flex-col p-20">
      <h1 className="text-2xl font-bold">Thank you for your review</h1>
    </section>
  </Layout>
}

export default Page


