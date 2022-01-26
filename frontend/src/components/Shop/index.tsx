import React from 'react'
import Link from 'next/link'

import { Divider } from '@/components'
import { useDispatch, useSelector } from '@/utils/store'
import {useFields} from '@/Form'

import { shopActions } from './slice'
import ProductImages from './ProductImages'
import ProductDetails from './ProductDetails'
import OrderOptions from './OrderOptions'
import AddToCart from './AddToCart'
import { AddToCartFields } from './types'

import Reviews from './Reviews'

export const Shop = ({ data }) => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    // Don't save selected date
    // Maybe should use react state instead
    dispatch(shopActions.hideDate())
  }, [])

  return (
    <div className="w-full items-center">
      <div className="px-4 xl:px:0 sm:flex-row flex-col w-full max-w-screen-xl mb-8">
        <ProductImages images={data.product.images} />
        <div className="w-4" />
        <Product data={data} />
      </div>
      <div className="w-full items-center" id="reviews">
        <Reviews slug={data.product.slug} />
      </div>
    </div>
  )
}

const Product = ({ data }) => {
  const { product } = data
  const state = useSelector((state) => state.shop)
  const fields = useFields<AddToCartFields>({
    size: { constraints: 'required' },
    selectedDate: {
      label: 'Rental Date',
      constraints: 'required',
      default: null,
    },
    rentalLength: { constraints: 'required', default: 'short' },
    rentType: { default: 'OneTime' },
  })

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
      <OrderOptions fields={fields} product={product} />
      <AddToCart fields={fields} product={product} />
      <div className="mb-4" />
      <div className="my-4">
        <ProductDetails state={state} product={product} />
      </div>
    </div>
  )
}

export default Shop
