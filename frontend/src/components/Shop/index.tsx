import React from 'react'
import Link from 'next/link'

import { Divider } from '@/components'
import { useSelector } from '@/utils/store'

import ProductImages from './ProductImages'
import ProductDetails from './ProductDetails'
import ProductRentHeaders from './ProductRentHeaders'
import ProductRentContents from './ProductRentContents'

export const Shop = ({ data }) => {
  return (
    <div className="items-center">
      <div className="px-4 xl:px:0 sm:flex-row flex-col w-full max-w-screen-xl">
        <ProductImages images={data.product.images} />
        <div className="w-4" />
        <Product data={data} />
      </div>
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
        {/* <Rating rating={4.5} /> */}
        {/* <Icon name="heart" size={24} /> */}
      </div>
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
      <ProductRentContents data={data} product={product} state={state} />
      <div className="mb-4" />
      {details.map((item, index) => (
        <React.Fragment key={item.label}>
          <ProductDetails
            index={index}
            item={item}
            selected={item.value === state.details}
            state={state}
            product={product}
            content={toValue(item.value, product)}
          />
        </React.Fragment>
      ))}
    </div>
  )
}

const toValue = (v: string | ((o: object) => any), o: object) =>
  typeof v === 'function' ? v(o) : o[v]

const details = [
  { value: (o: any) => o.designer.notes, label: 'Designer' },
  { value: 'details', label: 'Product Details' },
  { value: 'stylistNotes', label: 'Stylist Notes' },
  { value: 'sizingNotes', label: 'Style & Fit' },
  { value: 'share', label: 'Share' },
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
