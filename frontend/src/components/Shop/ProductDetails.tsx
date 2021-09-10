import React from 'react'
import Image from 'next/image'
import qs from 'qs'

import { Divider } from '@/components'
import { Icon } from '@/components'
import { useDispatch } from '@/utils/store'
import Markdown from '@/Markdown'
import useAnalytics from '@/utils/useAnalytics'

import { shopActions } from './slice'

export const ProductDetails = ({ state, product }) => {
  return (
    <>
      {details
        .filter((item) => toContent(item.value, product))
        .map((item, index) => {
          const content = toContent(item.value, product)

          if (!content) {
            return null
          }

          return (
            <React.Fragment key={item.label}>
              <ProductDetail
                index={index}
                item={item}
                selected={item.value === state.details}
                state={state}
                product={product}
                Content={content}
              />
            </React.Fragment>
          )
        })}
    </>
  )
}

const toContent = (v: string | ((o: object) => any), o: object) => {
  if (typeof v === 'function') {
    return v
  } else {
    const content = v.split('.').reduce((acc, key) => acc[key], o)
    if (content) {
      return () => (
        <div className="bg-gray-light px-2 py-4">
          <Markdown content={content} />
        </div>
      )
    } else {
      return null
    }
  }
}

const ProductDetail = ({ Content, index, state, selected, item, product }) => {
  const dispatch = useDispatch()
  const ref = React.useRef()

  return (
    <>
      <Divider visible={index !== 0} />
      <details
        onClick={(e) => {
          dispatch(shopActions.toggleDetails(item.value))
        }}
        open={selected}
      >
        <summary
          className="list-none cursor-pointer appearance-none"
          onClick={(e) => {
            e.preventDefault()
          }}
        >
          <div className="px-2 py-4 flex-row justify-between items-center">
            <span className={`${selected ? 'font-bold' : ''}`}>
              {item.label}
            </span>
            <Icon size={12} name={selected ? 'down' : 'up'} />
          </div>
        </summary>
        <div ref={ref}>
          <Content state={state} selected={selected} product={product} />
        </div>
      </details>
    </>
  )
}

const details = [
  { value: 'designer.notes', label: 'Designer' },
  { value: 'details', label: 'Product Details' },
  { value: 'stylistNotes', label: 'Stylist Notes' },
  { value: 'sizingNotes', label: 'Style & Fit' },
  {
    label: 'Share',
    value: ({ selected, product }) => (
      <div
        className={`flex-row px-2 pt-1 pb-4 space-x-2
          ${selected ? '' : 'hidden'}
          `}
      >
        {[
          <share.Facebook
            url={createProductURL(product)}
            description={product.description}
          />,
          <share.Pinterest
            url={createProductURL(product)}
            description={product.description}
            imageURL={product.images[0].url}
          />,
        ].map((share, i) => (
          <div key={i} className="w-16 h-8 relative cursor-pointer">
            {share}
          </div>
        ))}
      </div>
    ),
  },
]

const createProductURL = ({ slug, designer: { slug: designer_slug } }) =>
  `${process.env.NEXT_PUBLIC_FRONTEND}/shop/${designer_slug}/${slug}`

interface ShareFacebookConfig {
  url: string
  description: string
}

interface SharePinterestConfig {
  url: string
  description: string
  imageURL: string
}

// const ratio = 32 / 13
// const size = 28
// const shareStyle = { width: size * ratio, height: size }

const share = {
  Facebook: ({ url, description }: ShareFacebookConfig) => {
    const analytics = useAnalytics()
    return (
      <a
        target="_blank"
        rel="noreferrer"
        onClick={() =>
          analytics.logEvent('share', {
            type: 'facebook',
          })
        }
        href={
          'https://www.facebook.com/sharer/sharer.php?' +
          qs.stringify({
            u: url,
            quote: description,
            app_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
            redirect_uri: url,
            display: 'popup',
            kid_directed_site: '0',
          })
        }
      >
        <Image
          alt="Share on Facebook"
          layout="fill"
          objectFit="contain"
          src="/icons/facebook-share.png"
        />
      </a>
    )
  },

  Pinterest: ({ url, description, imageURL }: SharePinterestConfig) => {
    const analytics = useAnalytics()
    return (
      <a
        target="_blank"
        rel="noreferrer"
        onClick={() =>
          analytics.logEvent('share', {
            type: 'pinterest',
          })
        }
        href={
          'http://pinterest.com/pin/create/button/?' +
          qs.stringify({
            url,
            description,
            media: process.env.NEXT_PUBLIC_BACKEND + imageURL,
          })
        }
      >
        <Image
          alt="Share on Pinterest"
          layout="fill"
          objectFit="contain"
          src="/icons/pinit.jpg"
        />
      </a>
    )
  },
}

export default ProductDetails
