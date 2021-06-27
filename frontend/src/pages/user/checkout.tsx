import React from 'react'

import { useSelector } from '@/utils/store'
import Checkout from '@/User/Checkout'
import Layout from '@/Layout'

const Page = ({ data }) => {
  const user = useSelector((state) => state.user.data)

  React.useEffect(() => {
    if (user === null) {
      window.location.pathname = '/'
      return null
    }
  }, [])

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
