import React from 'react'
import Link from 'next/link'

import { Divider, Button, Rating } from '@/Components'
import { useDispatch, useSelector } from '@/utils/store'
import { useFields } from '@/Form'
import { Reviews, getReviews } from '@/Order/Review'
import { AddWardrobe } from '@/Wardrobe/AddWardrobe'

import { shopActions } from './slice'
import ProductImages from './ProductImages'
import ProductDetails from './ProductDetails'
import OrderOptions from './OrderOptions'
import AddToCart from './AddToCart'
import { AddToCartFields } from './types'
import UserWardrobeItem from './UserWardrobeItem'

export const Shop = ({ data }) => {
  const dispatch = useDispatch()
  const [reviews, setReviews] = React.useState()
  const slug = data.product.slug

  React.useEffect(() => {
    dispatch(shopActions.hideDate())
    // Don't need review data immediately
    getReviews({ slug, onSuccess: setReviews })
  }, [])

  return (
    <div className="w-full items-center">
      <div className="px-4 xl:px:0 sm:flex-row flex-col w-full max-w-screen-xl mb-8">
        <ProductImages images={data.product.images} />
        <div className="w-4" />
        <Product reviews={reviews} data={data} />
      </div>
      <div className="w-full items-center" id="reviews">
        <Reviews slug={data.product.slug} reviews={reviews} />
      </div>
    </div>
  )
}

const Product = ({ reviews, data }) => {
  const { product } = data
  const state = useSelector((state) => state.shop)
  const fields = useFields<AddToCartFields>({
    visible: { },
    size: { constraints: 'required' },
    selectedDate: {
      label: 'Rental Date',
      constraints: 'required',
      default: null,
    },
    rentalLength: { constraints: 'required', default: 'short' },
    rentType: { default: 'OneTime' },
  })

  if (product.user) {
    return <UserWardrobeItem state={state} product={product} />
  }

  return (
    <div className="w-full sm:w-1/2 sm:max-w-md">
      <div className="flex-row justify-between">
        <div>
          {product.designer
              ?
            <Link href={`/designers/${product.designer.slug}`}>
              <a>
                <span className="pt-4 font-bold text-xl underline sm:no-underline hover:underline">
                  {product.designer.name}
                </span>
              </a>
            </Link>
            : product.customDesignerName
            ? <span className="pt-4 font-bold text-xl underline sm:no-underline">
              product.customDesignerName
                  </span>
            : 'Unknown designer'
          }
          <span className="">{product.name}</span>
          {product.retailPrice && (
            <span className="text-gray-dark">
              £{product.retailPrice} Original Retail
            </span>
          )}
        </div>
        {reviews && reviews?.orders?.length > 0 && (
          <div className="flex-row items-center">
            <Rating rating={reviews.rating} emptyColor="text-white" />
            &nbsp;&nbsp;({reviews.orders.length})
          </div>
        )}
      </div>
      <Divider className="mt-2 mb-4" />
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
