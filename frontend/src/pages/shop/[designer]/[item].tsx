import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { StrapiProduct } from '@/types/models'
import useAnalytics from '@/utils/useAnalytics'
import { Button } from '@/Components'
import Shop from '@/Product/ProductPage'
import { getProduct } from '@/Product/api'
import Layout from '@/Layout'
import useData from '@/Layout/useData'

export const Page = ({ data }) => {
  const analytics = useAnalytics()
  const router = useRouter()
  React.useEffect(() => {
    analytics.viewContent()
  }, [])

  if (data.error) {
    return (
      <Layout title="Infinite Closet">
        <div className="w-full h-full items-center justify-center">
          <span className="font-bold text-2xl">
            Sorry, this page is unavailable.
          </span>
          <div className="h-8" />
          <Button onClick={() => router.push('/products/clothing')}>
            Continue shopping
          </Button>
        </div>
      </Layout>
    )
  }

  if (!data.product) {
      return <Layout title="Infinite Closet">
        <div className="w-full h-full items-center justify-center">
          <span className="font-bold text-2xl">
            Loading...
          </span>
        </div>
      </Layout>
  }

  const loading = useData(data)
  const title = loading
    ? 'Products'
    : data.product.designer
    ? `${data.product.name} by ${data.product.designer.name}`
    : data.product.name

  return (
    <>
      <OpenGraph {...data.product} />
      <Layout title={title}>
        <Shop data={data} />
      </Layout>
    </>
  )
}

const OpenGraph = (product: StrapiProduct) => {
  const router = useRouter()
  const { name, designer, shortRentalPrice, images, sizes, retailPrice } =
    product
  const url = process.env.NEXT_PUBLIC_FRONTEND + router.asPath.split('?')[0]
  const description = designer
    ? `Rent ${name} by ${designer.name} for only £${shortRentalPrice} at Infinite Closet`
    : `Rent ${name} for only £${shortRentalPrice} at Infinite Closet`
  const quantity = Object.values(sizes).reduce(
    (acc, { quantity }) => acc + quantity,
    0
  )

  const image = !images[0]
    ? {}
    : {
        'og:image_link': images[0].url,
        'og:image': images[0].url,
        'og:image:width': images[0].width,
        'og:image:height': images[0].height,
      }

  // open graph meta information
  const og = {
    'product:category': 'Clothing & Accessories > Clothing > Dresses',
    'product:retailer_item_id': product.id,
    'og:url': url,
    'og:type': 'og:product',
    'og:title': designer ? `${name} by ${designer.name}` : name,
    'og:description': description,
    'product:price:amount': retailPrice,
    'product:price:currency': 'GBP',
    'og:availability': quantity > 0 ? 'instock' : 'out of stock',
    ...image,
  }

  return (
    <Head>
      {Object.entries(og).map(([property, content]) => (
        <meta key={property} property={property} content={String(content)} />
      ))}
    </Head>
  )
}

export async function getServerSideProps({ params }) {
  try {
    const product = await getProduct(params)
    return {
      props: {
        data: { product },
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
