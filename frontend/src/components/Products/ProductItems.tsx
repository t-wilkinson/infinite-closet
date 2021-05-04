import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { Icon, CallToAction } from '@/components'
import { getURL } from '@/utils/api'

import { QUERY_LIMIT } from './constants'

export const ProductItems = ({ data, loading }) => {
  const router = useRouter()

  if (data.productsCount === 0) {
    return (
      <div className="items-center justify-center flex-grow px-1 h-64">
        <span className="py-8 text-xl font-bold">
          Sorry, we couldn't find any matches.
        </span>
        <CallToAction
          onClick={() => {
            router.push({
              pathname: router.pathname,
              query: { slug: router.query.slug },
            })
          }}
        >
          Browse All
        </CallToAction>
      </div>
    )
    // TODO: we have so few product it doesn't make sense to display this
    // } else if (loading || !data.products) {
  } else if (false) {
    return (
      <div className="flex-row flex-wrap">
        {Array(QUERY_LIMIT)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="w-1/2 lg:w-1/3">
              <div className="relative h-0 w-full overflow-hidden aspect-w-2 aspect-h-3">
                <div className="absolute top-0 left-0 w-full h-full b-gray p-2">
                  <div className="relative h-full bg-gray-light" />
                </div>
              </div>
            </div>
          ))}
      </div>
    )
  } else {
    return (
      <div className="w-full flex-row flex-wrap">
        {data.products?.map((item: any) => (
          <Product key={item.id} item={item} />
        ))}
      </div>
    )
  }
}

export default ProductItems

const Product = ({ item }: any) => {
  return (
    <div className="w-1/2 lg:w-1/3">
      <Link href={`/shop/${item.designer.slug}/${item.slug}`}>
        <a>
          <div className="relative w-full h-0 overflow-hidden cursor-pointer aspect-w-2 aspect-h-3">
            <div className="absolute top-0 left-0 w-full h-full p-2 border-transparent border hover:border-black">
              <ProductImage images={item.images} />
              <ProductInfo item={item} />
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}

const ProductImage = ({ images }) => (
  <div className="relative h-full bg-gray-light">
    <div className="absolute top-0 right-0 p-2">
      <Icon size={24} name="heart" />
    </div>
    <Image
      alt="Product image"
      src={getURL(images[0].url)}
      layout="fill"
      objectFit="contain"
    />
  </div>
)

const ProductInfo = ({ item }) => (
  <div className="flex-row justify-between mt-4">
    <div className="flex-grow">
      <span className="font-bold">{item.designer.name}</span>
      <span>{item.name}</span>
      <div className="flex-row mt-4">
        <span className="font-bold">£{item.rental_price}</span>
        <span className="font-gray">
          &nbsp;{'| '} £{item.retail_price} retail
        </span>
      </div>
    </div>
    <div className="self-end p-4 border border-black rounded-full">
      <Image
        alt="Shopping bag"
        width={16}
        height={16}
        src="/icons/shopping-bag.svg"
      />
    </div>
  </div>
)
