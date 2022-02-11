import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { getURL } from '@/utils/axios'
import { Button } from '@/Components'
import useAnalytics from '@/utils/useAnalytics'
import { StrapiProduct, StrapiFile } from '@/types/models'
import * as sizing from '@/utils/sizing'

import { QUERY_LIMIT } from './constants'

export const ProductItems = ({ data, loading }) => {
  const router = useRouter()

  if (data.productsCount === 0) {
    return (
      <div className="items-center justify-center flex-grow px-1 h-64 max-h-screen">
        <span className="py-8 text-xl font-bold">
          Sorry, we couldn't find any matches.
        </span>
        <Button
          onClick={() => {
            router.push({
              pathname: router.pathname,
              query: { slug: router.query.slug },
            })
          }}
        >
          Browse All
        </Button>
      </div>
    )
  } else if (loading) {
    return (
      <div className="flex-row flex-wrap">
        {Array(QUERY_LIMIT)
          .fill(0)
          .map((_, i) => (
            <ProductWrapper key={i}>
              <div
                className="relative w-full bg-gray-light"
                style={{
                  paddingTop: 'calc(135% + 96px)',
                }}
              />
            </ProductWrapper>
          ))}
      </div>
    )
  } else {
    return (
      <div className="w-full flex-row flex-wrap">
        {data.products?.map((product: StrapiProduct) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    )
  }
}

export const ProductWrapper = ({ children = null }) => (
  <div className="md:px-4 md:py-6 w-1/2 lg:w-1/3 ">
    <div
      className="w-full
        border-transparent border hover:border-gray  "
    >
      <div className="w-full h-full p-2">{children}</div>
    </div>
  </div>
)

export const Product = ({ product }: { product: StrapiProduct }) => {
  const analytics = useAnalytics()

  return (
    <ProductWrapper>
      <div
        className="relative w-full"
        style={{
          paddingTop: '135%',
        }}
      >
        <Link href={`/shop/${product.designer?.slug}/${product.slug}`}>
          <a
            className="absolute inset-0"
            onClick={() =>
              analytics.logEvent('select_item', {
                type: 'products.select-item',
              })
            }
          >
            <ProductImages product={product} />
          </a>
        </Link>
      </div>
      <ProductInfo product={product} />
    </ProductWrapper>
  )
}

export const ProductImages = ({ product }) => {
  const [hover, setHover] = React.useState<number>()
  const [index, setIndex] = React.useState<number>(0)
  const wrap = (i: number) => i % product.images.length
  const rotate = () => {
    setIndex((i) => wrap(i + 1))
  }

  return (
    <div
      className="w-full h-full relative"
      onMouseOver={() => {
        if (!hover) {
          const startRotate = () => setHover(window.setInterval(rotate, 1000))
          setHover(window.setTimeout(startRotate, 1000))
        }
      }}
      onMouseLeave={() => {
        setIndex(0)
        window.clearTimeout(hover)
        window.clearInterval(hover)
        setHover(undefined)
      }}
    >
      {product.images.map((image: StrapiFile, i: number) => {
        const format = image.formats.medium || image
        return (
          <div className="absolute inset-0 z-0" key={format.url}>
            <div
              className={`transition-opacity duration-1000 w-full h-full
            ${
              i === 0 && !hover
                ? 'opacity-100' // only show first image if not hovering
                : !hover
                ? 'hidden' // if not hovering, hide all other images
                : index === i
                ? 'opacity-0' // opacity (1 -> 0) the current image
                : wrap(index + 1) === i
                ? 'opacity-100' // transition to the next image
                : 'opacity-0' // otherwise hide the image
            }
            `}
            >
              <ProductImage
                alt={image.alternativeText}
                src={getURL(format.url)}
                ratio={format.height / format.width}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// TODO: use nextjs caching
const myLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`
  // return `https://infinitecloset.treywilkinson.com/_next/image?url=${encodeURIComponent(
  //   src,
  // )}&w=${width}&q=${quality || 75}`
}

const ProductImage = ({ alt, src, ratio }) => (
  <div className="relative h-full">
    <Image
      loader={myLoader}
      alt={alt}
      src={src}
      layout="fill"
      // objectFit="contain"
      objectFit={ratio > 1.4 ? 'contain' : 'cover'}
    />
  </div>
)

const rentalPrice = (low: number, high: number): string => {
  if (!low && !high) {
    return '£-'
  }
  return low === high ? `£${low}` : `£${low} - £${high}`
}

export const ProductInfo = ({ product }) => (
  <div className="w-full flex-row justify-between mt-4 relative text-sm leading-snug">
    <div className="flex-grow">
      <div className="inline-block">
        <Link href={`/designers/${product.designer?.slug}`}>
          <a>
            <span className="font-bold hover:underline">
              {product.designer?.name}
            </span>
          </a>
        </Link>
      </div>

      <div className="inline-block">
        <Link href={`/shop/${product.designer?.slug}/${product.slug}`}>
          <a className="hover:underline">
            <span>{product.name}</span>
          </a>
        </Link>
      </div>

      <span className="text-sm">{sizing.range(product.sizes).join(', ')}</span>
      <div className="h-2" />

      <div className="flex-col md:flex-row">
        <span className="font-bold">
          {rentalPrice(product.shortRentalPrice, product.longRentalPrice)}
        </span>
        <span>
          <span className="hidden md:inline">&nbsp;{'| '}</span>
          <span className="text-gray line-through">
            £{product.retailPrice || '-'} retail
          </span>
        </span>
      </div>
    </div>
  </div>
)

export default ProductItems
