import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { CallToAction } from '@/components'
import { getURL } from '@/utils/api'
import { StrapiFile } from '@/utils/models'

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
        {data.products?.map((item: any) => (
          <Product key={item.id} item={item} />
        ))}
      </div>
    )
  }
}

export default ProductItems

export const Product = ({ item }: any) => {

  return (
    <div className="w-1/2 lg:w-1/3">
      <div className="m-2 lg:m-4">
        <Link href={`/shop/${item.designer?.slug}/${item.slug}`}>
          <a>
            <div className="relative w-full md:h-0 overflow-hidden cursor-pointer md:aspect-w-2 md:aspect-h-3 h-96">
              <div className="absolute top-0 left-0 w-full h-full p-2 border-transparent border hover:border-gray">
                <ProductImages item={item} />
                <ProductInfo item={item} />
              </div>
            </div>
          </a>
        </Link>
      </div>
    </div>
  )
}

const ProductImages = ({item}) => {
  const [hover, setHover] = React.useState<number>()
  const [index, setIndex] = React.useState<number>(0)
  const wrap = (i: number) => i % item.images.length
  const rotate = () => {
    setIndex((i) => wrap(i + 1))
  }

  return <div
    className="w-full h-full relative"
    onMouseOver={() => {
      if (!hover) {
        const startRotate = () =>
          setHover(window.setInterval(rotate, 1000))
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
    {item.images.map((image: StrapiFile, i: number) => (
      <div className="absolute inset-0 z-0" key={i}>
        <div
          className={`transition-opacity duration-1000 w-full h-full
            ${ i === 0 && !hover
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
            src={getURL(image.formats.small?.url || image.url)}
          />
        </div>
      </div>
    ))}
  </div>
}

// TODO: use nextjs caching
const myLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`
  // return `https://infinitecloset.treywilkinson.com/_next/image?url=${encodeURIComponent(
  //   src,
  // )}&w=${width}&q=${quality || 75}`
}

const ProductImage = ({ alt, src }) => (
  <div className="relative h-full">
    {/* <div className="absolute top-0 right-0 p-2"> */}
    {/*   <Icon size={20} name="heart" /> */}
    {/* </div> */}
    <Image
      loader={myLoader}
      alt={alt}
      src={src}
      layout="fill"
      objectFit="contain"
    />
  </div>
)

const rentalPrice = (low: number, high: number): string => {
  if (!low && !high) {
    return '£-'
  }
  return low === high ? `£${low}` : `£${low} - £${high}`
}

const ProductInfo = ({ item }) => (
  <div className="flex-row justify-between mt-4">
    <div className="flex-grow">
      <span className="font-bold">{item.designer?.name}</span>
      <span>{item.name}</span>
      <span className="text-sm">
        {item.sizes.map(v => v.size).join(', ')}
      </span>
      <div className="flex-col md:flex-row">
        <span className="font-bold">
          {rentalPrice(item.shortRentalPrice, item.longRentalPrice)}
        </span>
        <span className="font-gray">
          <span className="hidden md:inline">&nbsp;{'| '}</span> £
          {item.retailPrice || '-'} retail
        </span>
      </div>
    </div>
    {/* <div className="self-end p-4 border border-gray-light rounded-full"> */}
    {/*   <Icon name="shopping-bag" size={16} /> */}
    {/* </div> */}
  </div>
)
