import React from 'react'
import Link from 'next/link'

import { displayUsername } from '@/User/utils'
import { ProductItem } from '@/Product/ProductItem'
import { StrapiWardrobe, StrapiProduct } from '@/types/models'

export const Wardrobe = ({ tagsHref, wardrobe, products }: {
  tagsHref: string
  wardrobe: StrapiWardrobe
  products: StrapiProduct[]
}) => {
  const username = displayUsername(wardrobe.user.username)

  return (
    <div className="px-2 w-full bg-white mb-8">
      <div className="w-full text-xl mt-2 flex-row items-center">
          <Link href={`/wardrobes/items/${wardrobe.user.username}?wardrobes=${wardrobe.slug}`}>
            <a>
        <span className="font-bold">
          {wardrobe.name}
        </span>
          </a>
            </Link>
        &nbsp;by&nbsp;<Link href={`/wardrobes?search=${username}`}>
          <a className="underline">
          {username}
          </a>
        </Link>
        <div className="flex-row ml-4">
          {wardrobe.tags.map((tag) => <WardrobeTag key={tag.id} href={tagsHref} tag={tag} />)}
        </div>
      </div>
      <div className="w-full text-sm mt-2 mb-4">
        {wardrobe.description}
      </div>
      <WardrobeProducts products={products} />
    </div>
  )
}

const WardrobeTag = ({href, tag}) =>
  <Link href={`${href}?tag=${tag.name}`}>
    <a>
    <span className="rounded-lg bg-pri-white px-2 py-1 mt-2 mr-2 cursor-pointer text-sm">
      {tag.name}
    </span>
    </a>
  </Link>

const WardrobeProducts = ({products}) =>
      <div className="shrink-0 flex-row overflow-x-auto">
        {products.length === 0
          ? <div className="w-full h-24 bg-gray-light grid place-items-center">
            <span className="">
              No products in this wardrobe
            </span>
          </div>
          : products.map(product => <WardrobeProduct key={product.id} product={product} />)
        }
        {products.length > 10 && (
              <div
                className="relative bg-gray-light flex-none grid place-items-center w-48 h-full"
              >
                <span>
                  +{products.length - 10} more items
                </span>
              </div>
        )}
      </div>

const WardrobeProduct = ({product}) => {
  return <div className="w-48 flex-none mr-4">
    <ProductItem product={product} />
  </div>
}
