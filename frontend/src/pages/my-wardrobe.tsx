import React from 'react'

import Layout from '@/Layout'
import { getWardrobe } from '@/Product/api'

export const Page = ({ data }) => {
  console.log('data', data)

  return <Layout title="My Wardrobe">
  </Layout>
}

export async function getServerSideProps({ params }) {
  try {
    const wardrobe = await getWardrobe(params)
    return {
      props: {
        data: { wardrobe },
      },
    }
  } catch (e) {
    return {
      props: {
        data: { error: e.response?.status || null },
      },
    }
  }
}

export default Page
