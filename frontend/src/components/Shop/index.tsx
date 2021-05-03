import React from 'react'

import { Divider, Icon } from '@/components'
import { useSelector } from '@/utils/store'

import ProductImages from './ProductImages'
import ProductDetails from './ProductDetails'
import ProductRentHeaders from './ProductRentHeaders'
import ProductRentContents from './ProductRentContents'

export const Shop = ({ data }) => {
  return (
    <div className="px-4 sm:flex-row flex-col w-full">
      <ProductImages images={data.product.images} />
      <div className="w-4" />
      <Product data={data} />
    </div>
  )
}
export default Shop

const Product = ({ data }) => {
  const { product } = data
  const state = useSelector((state) => state.shop)

  return (
    <div className="w-full sm:w-1/2 sm:max-w-md">
      <div className="flex-row justify-between items-center">
        <Rating rating={4.5} />
        <Icon name="heart" size={24} />
      </div>
      <span className="pt-4 font-subheader text-xl">
        {product.designer.name}
      </span>
      <span className="">{product.name}</span>
      <span className="pb-2 text-gray-dark">
        Retails for £{product.retail_price}
      </span>
      <Divider className="mb-4" />
      <ProductRentHeaders product={product} state={state} />
      <ProductRentContents product={product} state={state} />
      <div className="mb-4" />
      {details.map((item, index) => (
        <React.Fragment key={item.key}>
          <Divider visible={index !== 0} />
          <ProductDetails
            key={item.key}
            item={item}
            selected={item.key === state.details}
            product={product}
          />
        </React.Fragment>
      ))}
    </div>
  )
}

const details = [
  { key: 'stylist_notes', label: 'Stylist Notes' },
  { key: 'description', label: 'Product Description' },
  { key: 'share', label: 'Share' },
]

const Rating = ({ rating }: any) => (
  <div className="flex-row">
    {/* <FontAwesome name="star" size={18} color="black" /> */}
    {/* <FontAwesome name="star" size={18} color="black" /> */}
    {/* <FontAwesome name="star" size={18} color="black" /> */}
    {/* <FontAwesome name="star-half-empty" size={18} color="black" /> */}
    {/* <FontAwesome name="star-o" size={18} color="black" /> */}
  </div>
)