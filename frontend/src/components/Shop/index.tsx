import React from 'react'
import Link from 'next/link'

import { Divider } from '@/components'
import { useDispatch, useSelector } from '@/utils/store'
import * as sizing from '@/utils/sizing'
import { Size } from '@/Products/types'

import { shopActions } from './slice'
import ProductImages from './ProductImages'
import ProductDetails from './ProductDetails'
import ProductRentHeaders from './ProductRentHeaders'
import ProductRentContents from './ProductRentContents'

export const Shop = ({ data }) => {
  return (
    <div className="px-4 xl:px:0 sm:flex-row flex-col w-full max-w-screen-xl mb-8">
      <ProductImages images={data.product.images} />
      <div className="w-4" />
      <Product data={data} />
    </div>
  )
}

const Product = ({ data }) => {
  const { product } = data
  const state = useSelector((state) => state.shop)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.data)

  React.useEffect(() => {
    if (user?.dressSize) {
      dispatch(shopActions.changeSize(user.dressSize as Size))
    } else if (!sizing.get(product.sizes, state.size) && product.sizes[0]) {
      dispatch(shopActions.changeSize(product.sizes[0].size))
    }
  }, [user])

  return (
    <div className="w-full sm:w-1/2 sm:max-w-md">
      <div className="flex-row justify-between items-center"></div>
      <Link href={`/designers/${product.designer.slug}`}>
        <a>
          <span className="pt-4 font-bold text-xl hover:underline">
            {product.designer.name}
          </span>
        </a>
      </Link>
      <span className="">{product.name}</span>
      {product.retailPrice && (
        <span className="pb-2 text-gray-dark">
          £{product.retailPrice} Original Retail
        </span>
      )}
      <Divider className="mb-4" />
      <ProductRentHeaders product={product} state={state} />
      <ProductRentContents product={product} />
      <div className="mb-4" />
      <div className="my-4">
        <ProductDetails state={state} product={product} />
      </div>
    </div>
  )
}

export default Shop
