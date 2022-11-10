import React from 'react'
import Link from 'next/link'

import { Divider, Button, Rating } from '@/Components'
import EditWardrobeItem from '@/Wardrobe/EditWardrobeItem'
import { AddWardrobe } from '@/Wardrobe/AddWardrobe'

import ProductDetails from './ProductDetails'

export const UserWardrobeItem = ({state, product}) => {
  const [wardrobePopupVisible, setWardrobePopupVisible] = React.useState(false)

  return <div className="w-full sm:w-1/2 sm:max-w-md">
    <div className="flex-row justify-between">
      <div>
        <Link href={`/designers/${product.designer.slug}`}>
          <a>
            <span className="pt-4 font-bold text-xl underline sm:no-underline hover:underline">
              {product.designer.name}
            </span>
          </a>
        </Link>
        <span className="">{product.name}</span>
      </div>
    </div>
    <Divider className="mt-2 mb-4" />
    <Button
      role="secondary"
      onClick={() => {
        setWardrobePopupVisible(true)
      }}
    >
      Update Wardrobes
    </Button>
    <div className="mt-4">
      <EditWardrobeItem product={product} />
    </div>
    <Divider className="mt-4 mb-4" />
    <div className="my-4">
      <ProductDetails state={state} product={product} />
    </div>
    <AddWardrobe product={product} visible={wardrobePopupVisible} setVisible={setWardrobePopupVisible} />
  </div>
}

export default UserWardrobeItem
