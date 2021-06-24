import Head from 'next/head'
import { useRouter } from 'next/router'
import axios from 'axios'

import Shop from '@/Shop'
import Header from '@/Layout/Header'
import Footer from '@/Layout/Footer'
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

  // open graph meta information
  const og = [
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'og:product' },
    { property: 'og:title', content: `${name} by ${designer.name}` },
    { property: 'og:description', content: description },
    images[0] && { property: 'og:image', content: images[0].url },
    { property: 'product:price:amount', content: String(retailPrice) },
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

export async function getServerSideProps({ params }) {
  const [sizeChart, product] = await Promise.all([
    axios.get('/products/size-chart').then((res) => res.data),
    axios.get(`/products/shop/${params.item}`).then((res) => res.data),
  ])

  return {
    props: {
      data: { sizeChart, product },
    },
  }
}
export default Page
