import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { getURL } from '@/utils/axios'
import useAnalytics from '@/utils/useAnalytics'
import { useDispatch, useSelector } from '@/utils/store'
import * as sizing from '@/utils/sizing'
import { OrderUtils, addToFavorites } from '@/Order'
import { StrapiProduct } from '@/types/models'
import { Icon, iconHeartFill } from '@/Components/Icons'
import { useFields } from '@/Form'

import { AddToCartFields } from './ProductPage/types'
import styles from './Products.module.css'

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

const AddToFavorites = ({product}) => {
  const [addedFavorite, setAddedFavorite] = React.useState(false)

  const favorites = useSelector((state) => state.orders.favorites)
  const isFavorite = favorites.find(o => o.product.id === product.id)
  const dispatch = useDispatch()
    const analytics = useAnalytics()
  const user = useSelector((state) => state.user.data)

  const fields = useFields<AddToCartFields>({
    visible: { },
    size: { constraints: 'required', default: product.sizes[0]?.size },
    selectedDate: {
      label: 'Rental Date',
      constraints: 'required',
      default: null,
    },
    rentalLength: { constraints: 'required', default: 'short' },
    rentType: { default: 'OneTime' },
  })

  React.useEffect(() => {
    dispatch(OrderUtils.favorites())
  }, [user])

  if (!product.sizes[0]?.size) {
    return null
  }

  return <button
    className="stroke-pri p-2 border border-transparent hover:border-gray-light"
      disabled={addedFavorite}
      onClick={() => {
        addToFavorites({fields, dispatch, analytics, user, product})
        .then(() => setAddedFavorite(true))
      }}
  >
    <Icon className={`${isFavorite ? 'text-red' : 'text-transparent'} stroke-2 stroke-pri`}
    icon={iconHeartFill} size={32} />
  </button>
}

export const WrappedProductItem = ({ product }: { product: StrapiProduct }) =>
  <ProductWrapper>
    <ProductItem product={product} />
  </ProductWrapper>


export const ProductItem = ({ product }: { product: StrapiProduct }) => {
  const analytics = useAnalytics()

  return (
    <>
      <div
        className="relative w-full"
        style={{
          paddingTop: '135%',
        }}
      >
        <Link href={`/shop/${product.customDesignerName || product.designer?.slug || 'unknown'}/${product.slug}`}>
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
        <div className="absolute top-0 right-0">
          <AddToFavorites product={product} />
        </div>
      </div>
      <ProductInfo product={product} />
      </>
  )
}

const ProductImageWrapper = ({ image, hover, show = false, hide = false }) => (
  <div className="absolute inset-0 z-0" key={image.url}>
    <div
      className={`relative w-full h-full
        ${
          !hover && hide
            ? ''
            : !hover
            ? 'hidden'
            : show
            ? styles['animate-show'] // only show first image if not hovering
            : hide
            ? styles['animate-hide']
            : 'hidden'
        }
    `}
    >
      <ProductImage
        alt={image.alternativeText}
        src={getURL(image.url)}
        ratio={image.height / image.width}
      />
    </div>
  </div>
)

export const ProductImages = ({ product }) => {
  const [hoverInterval, setHoverInterval] = React.useState<number>()
  const [index, setIndex] = React.useState<number>(0)
  const wrap = (i: number) => i % product.images.length
  const rotate = () => {
    setIndex((i) => wrap(i + 1))
  }

  const getSrc = (index: number) => {
    const image = product.images[index]
    return { ...image, ...(image.formats?.medium || null) }
  }

  return (
    <div
      className="w-full h-full relative"
      onMouseOver={() => {
        if (!hoverInterval) {
          setHoverInterval(window.setInterval(rotate, 2000))
        }
      }}
      onMouseLeave={() => {
        setIndex(0)
        window.clearInterval(hoverInterval)
        setHoverInterval(undefined)
      }}
    >
      {product.images.map((_: any, i: number) => {
        // TODO: What about prodcuts with only one image
        const image = getSrc(i)
        return <ProductImageWrapper
          key={i}
          hover={hoverInterval}
          hide={i === index}
          show={i === wrap(index + 1)}
          image={image}
        />
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
        <Link href={`/designers/${product.customDesignerName || product.designer?.slug}`}>
          <a>
            <span className="font-bold hover:underline">
              {product.designer?.name}
            </span>
          </a>
        </Link>
      </div>

      <div className="inline-block">
        <Link href={`/shop/${product.customDesignerName || product.designer?.slug}/${product.slug}`}>
          <a className="hover:underline">
            <span>{product.name}</span>
          </a>
        </Link>
      </div>

      {product.user ?
        <span className="mt-6 font-bold">
          Your outfit
        </span>
        :
      <>
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
      </>
      }
    </div>
  </div>
)

export default ProductItem
