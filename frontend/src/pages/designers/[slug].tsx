import React from 'react'
import axios from 'axios'

import { Divider } from '@/components'
import Layout from '@/Layout'
import Markdown from '@/Markdown'
import { Product } from '@/Products/ProductItems'
import { StrapiProduct } from '@/utils/models'

export const Page = ({ data }) => {
  const designer = data.designer

  return (
    <Layout title={`${designer.name} | Infinite Closet`}>
      <div className="w-full h-full items-center">
        <div className="max-w-screen-md w-full">
          <h1 className="text-4xl font-subheader text-center">
            {designer.name}
          </h1>
          <Markdown content={designer.description} />

          <Divider />

          <div className="flex-row flex-wrap w-full">
            {designer.products.map((product: StrapiProduct) => (
              <Product key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Page

export const getServerSideProps = async ({ params }) => {
  const [designers] = await Promise.all([
    axios.get(`/designers?slug=${params.slug}`),
  ])

  return {
    props: {
      data: {
        designer: designers.data[0],
      },
    },
  }
}
