import React from 'react'

import { Divider } from '@/components'
import { Icon } from '@/components'
import Share from '@/utils/share'
import { useDispatch } from '@/utils/store'
import Markdown from '@/Markdown'

import { shopActions } from './slice'

export const ProductDetails = ({
  content,
  index,
  state,
  selected,
  item,
  product,
}) => {
  const dispatch = useDispatch()

  const Details =
    details[item.value] ||
    (() => (
      <div className="bg-gray-light px-2 py-4">
        <Markdown content={content} />
      </div>
    ))

  // TODO: move this statement to parent
  if (!details[item.value] && !content) {
    return null
  }

  return (
    <>
      <Divider visible={index !== 0} />
      <details
        onClick={(e) => {
          e.preventDefault()
          dispatch(shopActions.toggleDetails(item.value))
        }}
        open={selected}
      >
        <summary className="list-none cursor-pointer">
          <div className="px-2 py-4 flex-row justify-between items-center">
            <span className={`${selected ? 'font-bold' : ''}`}>
              {item.label}
            </span>
            <Icon size={12} name={selected ? 'down' : 'up'} />
          </div>
        </summary>
        <Details state={state} selected={selected} product={product} />
      </details>
    </>
  )
}

const details = {
  share: ({ selected, product }) => (
    <div
      className={`flex-row px-2 pt-1 pb-4 space-x-2
        ${selected ? '' : 'hidden'}
        `}
    >
      {[
        <Share.Facebook
          url={createProductURL(product)}
          description={product.description}
        />,
        // <Share.Pinterest
        //   url={createProductURL(product)}
        //   description={product.description}
        //   imageURL={product.images[0].url}
        // />,
      ].map((share, i) => (
        <div key={i} className="w-16 h-8 relative cursor-pointer">
          {share}
        </div>
      ))}
    </div>
  ),
} as const

const createProductURL = ({ slug, designer: { slug: designer_slug } }) =>
  `${process.env.NEXT_PUBLIC_FRONTEND}/shop/${designer_slug}/${slug}`

export default ProductDetails
