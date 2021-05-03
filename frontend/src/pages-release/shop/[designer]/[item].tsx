import Head from 'next/head'

import Shop from '@/Shop'
import Header from '@/Layout/Header'
import Footer from '@/Layout/Footer'
import { Divider } from '@/components'
import { fetchAPI } from '@/utils/api'
// import useLoading from '@/utils/useLoading'
import useData from '@/Layout/useData'

export const Page = ({ data }) => {
  const loading = useData(data)
  // addOpenGraphTags(query.data.shopItems[0])

  return (
    <>
      <Head>
        {!loading && (
          <title>
            {data.product.name} by {data.product.designer.name}
          </title>
        )}
      </Head>
      <Header />
      <Shop data={data} />
      <Divider />
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

const addOpenGraphTags = async ({
  name,
  designer,
  rental_price,
  title,
  site_name,
  images,
  sizes,
  retail_price,
}) => {
  const url = window.location.href
  const head = document.querySelector('head')
  head?.appendChild(document.createComment('open graph'))

  const description = `Rent ${name} by ${designer} for only ${rental_price} only at Infinite Closet.`
  const quantity = Object.values(sizes as { quantity: number }[]).reduce(
    (acc, { quantity }) => acc + quantity,
    0,
  )

  // Can do better here
  // open graph meta information
  const og = [
    { property: 'og:url', content: url },
    { property: 'og:type', content: 'og:product' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    images[0] && { property: 'og:image', content: images[0] },
    { property: 'og:site_name', content: site_name },
    { property: 'product:price:amount', content: String(retail_price) },
    { property: 'product:price:currency', content: 'GBP' },
    {
      property: 'og:availability',
      content: quantity > 0 ? 'instock' : 'out of stock',
    },
  ]

  // create <meta /> tags from 'og' and apend them to <head />
  og.forEach(({ property, content }) => {
    const meta = document.createElement('meta')
    meta.setAttribute('property', property)
    meta.setAttribute('content', content)
    head?.appendChild(meta)
  })
}
