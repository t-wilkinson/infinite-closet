import React from 'react'

import Checkout from '@/User/Checkout'
import Layout from '@/Layout'
import { useProtected } from '@/User/Protected'

const Page = ({ data }) => {
  const user = useProtected()

  if (user === undefined) {
    return null
  }

  return (
    <Layout>
      <Checkout user={user} data={data} />
    </Layout>
  )
}
export default Page

export const getServerSideProps = async ({ params, query }) => {
  return {
    props: {},
  }
}
