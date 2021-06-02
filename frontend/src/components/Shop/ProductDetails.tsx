import React from 'react'

import { Icon } from '@/components'
import Share from '@/utils/share'
import { useDispatch } from '@/utils/store'

import { shopActions } from './slice'

export const ProductDeatils = ({ state, selected, item, product }) => {
  const dispatch = useDispatch()

  const Details =
    details[item.key] ||
    (() => (
      <div className={`bg-gray-light px-2 py-4 ${selected ? '' : 'hidden'} `}>
        <span>{product[item.key]}</span>
      </div>
    ))

  return (
    <>
      <button onClick={() => dispatch(shopActions.toggleDetails(item.key))}>
        <div className="px-2 py-4 flex-row justify-between items-center">
          <span className={`${selected ? 'font-bold' : ''}`}>{item.label}</span>
          <Icon size={12} name={selected ? 'down' : 'up'} />
        </div>
      </button>
      <Details state={state} selected={selected} product={product} />
    </>
  )
}
export default ProductDeatils

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
  typeof window !== 'undefined' &&
  `${process.env.NEXT_PUBLIC_DOMAIN}/shop/${designer_slug}/${slug}`
