import React from 'react'
import {useRouter} from 'next/router'

import Layout from '@/Layout'
import AddReview from '@/Shop/AddReview'

export const Page = () => {
  const [router, setRouter] = React.useState(null)
  React.useEffect(() => {
    setRouter(useRouter())
  }, [])
  const slug = router?.query.slug

  return <Layout title="Review Your Purchases">
    <section className="max-w-screen-lg w-full">
      <AddReview />
    </section>
  </Layout>
}

export default Page

