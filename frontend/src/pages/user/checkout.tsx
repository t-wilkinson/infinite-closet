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
    <Layout spacing={false}>
      <Checkout user={user} data={data} />
    </Layout>
  )
}

export const getServerSideProps = async ({ params, query }) => {
  return {
    props: {},
  }
}

export default Page
