import Head from 'next/head'
import { useRouter } from 'next/router'
import axios from 'axios'

import Shop from '@/Shop'
import Header from '@/Layout/Header'
import Footer from '@/Layout/Footer'
import useData from '@/Layout/useData'
import { StrapiProduct } from '@/utils/models'
import { normalizeSize } from '@/Products/helpers'

export const Page = ({ data }) => {
  const loading = useData(data)

  return (
    <>
      <Head>
        {!loading && (
          <title>
            {data.product.name} by {data.product.designer.name}
          </title>
        )}
      </Head>
      <OpenGraph {...data.product} />
      <Header />
      <Shop data={data} />
      <Footer />
    </>
  )
}

const OpenGraph = (product: StrapiProduct) => {
  const { name, designer, shortRentalPrice, images, sizes, retailPrice } =
    product
  const router = useRouter()
  const url = router.asPath.split('?')[0]
  const description = `Rent ${name} by ${designer.name} for only ${shortRentalPrice} only at Infinite Closet.`
  const quantity = Object.values(sizes as { quantity: number }[]).reduce(
    (acc, { quantity }) => acc + quantity,
    0,
  )
  const image = images[0]
    ? []
    : [
        { property: 'og:image', content: images[0].url },
        { property: 'og:image:width', content: images[0].width },
        { property: 'og:image:height', content: images[0].height },
      ]

  // open graph meta information
  const og = [
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'og:product' },
    { property: 'og:title', content: `${name} by ${designer.name}` },
    { property: 'og:description', content: description },
    { property: 'product:price:amount', content: retailPrice },
    { property: 'product:price:currency', content: 'GBP' },
    {
      property: 'og:availability',
      content: quantity > 0 ? 'instock' : 'out of stock',
    },
    ...image,
  ]

  return (
    <Head>
      {og.map(({ property, content }) => (
        <meta key={property} property={property} content={String(content)} />
      ))}
    </Head>
  )
}

export async function getServerSideProps({ params }) {
  const [sizeChart, product] = await Promise.all([
    axios.get('/products/size-chart').then((res) => res.data),
    axios.get(`/products/shop/${params.item}`).then((res) => res.data),
  ])

  for (const [key, size] of Object.entries(product.sizes)) {
    product.sizes[key].size = normalizeSize(size.size)
  }

  return {
    props: {
      data: { sizeChart, product },
    },
  }
}
export default Page
