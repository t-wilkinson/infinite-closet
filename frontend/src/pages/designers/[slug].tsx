import React from 'react'

import axios from '@/utils/axios'
import { Divider } from '@/components'
import Layout from '@/Layout'
import Markdown from '@/Markdown'
import { Product } from '@/Products/ProductItems'
import { StrapiProduct, StrapiDesigner } from '@/utils/models'

export const Page = ({ data }) => {
  const designer = data.designer

  return (
    <Layout title={designer.name}>
      <div className="w-full h-full items-center">
        <div className="max-w-screen-lg w-full">
          <h1 className="text-4xl font-subheader text-center">
            {designer.name}
          </h1>
          <Markdown content={designer.description} />

          <Divider />

          <div className="flex-row flex-wrap w-full">
            {designer.products.map((product: StrapiProduct) => (
              <Product key={product.id} product={product} />
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
    axios.get<StrapiDesigner[]>(`/designers?slug=${params.slug}`, {
      withCredentials: false,
    }),
  ])
  const designer = designers[0]
  for (const product of designer.products) {
    product.designer = { ...designer }
    delete product.designer.products
  }

  return {
    props: {
      data: {
        designer,
      },
    },
  }
}
