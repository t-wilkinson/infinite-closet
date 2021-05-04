import Head from 'next/head'
import { useRouter } from 'next/router'

import Shop from '@/Shop'
import Header from '@/Layout/Header'
import Footer from '@/Layout/Footer'
import { fetchAPI } from '@/utils/api'
import useData from '@/Layout/useData'
import { StrapiProduct } from '@/utils/models'

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
export default Page

export async function getServerSideProps({ params }) {
  const [product] = await Promise.all([
    fetchAPI(`/products?_limit=1&slug=${params.item}`),
  ])

  return {
    props: {
      data: { product: product[0] },
    },
  }
}

const OpenGraph = (product: StrapiProduct) => {
  const { name, designer, rental_price, images, sizes, retail_price } = product
  const router = useRouter()
  const url = router.asPath.split('?')[0]

  const description = `Rent ${name} by ${designer.name} for only ${rental_price} only at Infinite Closet.`
  const quantity = Object.values(sizes as { quantity: number }[]).reduce(
    (acc, { quantity }) => acc + quantity,
    0,
  )

  // open graph meta information
  const og = [
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'og:product' },
    { property: 'og:title', content: `${name} by ${designer.name}` },
    { property: 'og:locale', content: 'en_GB' },
    { property: 'og:description', content: description },
    images[0] && { property: 'og:image', content: images[0].url },
    { property: 'og:site_name', content: 'Infinite Closet' },
    { property: 'product:price:amount', content: String(retail_price) },
    { property: 'product:price:currency', content: 'GBP' },
    {
      property: 'og:availability',
      content: quantity > 0 ? 'instock' : 'out of stock',
    },
  ]

  return (
    <Head>
      {og.map(({ property, content }) => (
        <meta key={property} property={property} content={content} />
      ))}
    </Head>
  )
}
