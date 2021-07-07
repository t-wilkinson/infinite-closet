import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { CallToAction } from '@/components'
import { getURL } from '@/utils/api'
import { StrapiProduct, StrapiFile } from '@/utils/models'

import { sortSizes, sizeRange } from './helpers'
import { QUERY_LIMIT } from './constants'

export const ProductItems = ({ data, loading }) => {
  const router = useRouter()

  if (data.productsCount === 0) {
    return (
      <div className="items-center justify-center flex-grow px-1 h-64 max-h-screen">
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
        {data.products?.map((product: StrapiProduct) => (
          <Product product={product} />
        ))}
      </div>
    )
  }
}

export default ProductItems

export const Product = ({ product }: any) => {
  return (
    <div className="w-1/2 lg:w-1/3 flex-shrink">
      <div className="m-2 lg:m-4 w-full">
        <div className="w-full h-full p-2 border-transparent border hover:border-gray">
          <div
            className="relative w-full md:h-0"
            style={{
              paddingTop: '100%',
            }}
          >
            <Link href={`/shop/${product.designer?.slug}/${product.slug}`}>
              <a className="absolute inset-0 w-full h-full">
                <ProductImages product={product} />
              </a>
            </Link>
          </div>
          <div className="w-full h-full flex-grow flex-shrink-0">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}

const ProductImages = ({ product }) => {
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
        const format = image.formats.small || image
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
    {/* <div className="absolute top-0 right-0 p-2"> */}
    {/*   <Icon size={20} name="heart" /> */}
    {/* </div> */}
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

const ProductInfo = ({ product }) => (
  <div className="flex-row justify-between mt-4 relative flex-grow">
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
      <span className="text-sm">
        {sizeRange(product.sizes).sort(sortSizes).join(', ')}
      </span>
      <div className="flex-col md:flex-row">
        <span className="font-bold">
          {rentalPrice(product.shortRentalPrice, product.longRentalPrice)}
        </span>
        <span className="font-gray">
          <span className="hidden md:inline">&nbsp;{'| '}</span> £
          {product.retailPrice || '-'} retail
        </span>
      </div>
    </div>
    {/* <div className="self-end p-4 border border-gray-light rounded-full"> */}
    {/*   <Icon name="shopping-bag" size={16} /> */}
    {/* </div> */}
  </div>
)
