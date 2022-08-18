import React from 'react'
import { useRouter } from 'next/router'

import { Button } from '@/Components'
import { StrapiProduct } from '@/types/models'

import { QUERY_LIMIT } from './constants'
import { WrappedProductItem, ProductWrapper } from './ProductItem'

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
          <WrappedProductItem key={product.id} product={product} />
        ))}
      </div>
    )
  }
}

export default ProductItems
