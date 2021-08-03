import React from 'react'
import { useRouter } from 'next/router'

import Checkout from '@/User/Checkout'
import Layout from '@/Layout'
import { useSelector } from '@/utils/store'

const Page = () => {
  const user = useSelector((state) => state.user.data)
  const router = useRouter()

  if (user === undefined) {
    return null
  }

  return (
    <Layout spacing={false}>
      <Checkout user={user} />
    </Layout>
  )
}

export const getServerSideProps = async () => {
  return {
    props: {},
  }
}

export default Page
