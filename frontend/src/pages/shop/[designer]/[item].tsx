import Head from 'next/head'
import { useRouter } from 'next/router'
import axios from 'axios'

import Shop from '@/Shop'
import Layout from '@/Layout'
import useData from '@/Layout/useData'
import { StrapiProduct } from '@/utils/models'
import useAnalytics from '@/utils/useAnalytics'

export const Page = ({ data }) => {
  const loading = useData(data)
  const title = loading
    ? undefined
    : `${data.product.name} by ${data.product.designer.name}`
  const analytics = useAnalytics()
  analytics.viewContent()

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
  const { name, designer, shortRentalPrice, images, sizes, retailPrice } =
    product
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_FRONTEND + router.asPath.split('?')[0]
  const description = `Rent ${name} by ${designer.name} for only £${shortRentalPrice} at Infinite Closet`
  const quantity = Object.values(sizes as { quantity: number }[]).reduce(
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
    'og:title': `${name} by ${designer.name}`,
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
  const product: StrapiProduct = await axios
    .get(`/products/shop/${params.item}`)
    .then((res) => res.data)

  return {
    props: {
      data: { product },
    },
  }
}
export default Page
