import React from 'react'
import Link from 'next/link'

import useAnalytics from '@/utils/useAnalytics'
import Layout from '@/Layout'
import User from '@/User'
import { CartUtils } from '@/Cart/slice'
import { useDispatch, useSelector } from '@/utils/store'
import {
  ProductImages,
  ProductInfo,
} from '@/Products/ProductItems'
import { StrapiOrder } from '@/types/models'
import { EditCartItem, removeOrderItem } from '@/Cart'

export const Page = () => {
  const favorites = useSelector((state) => state.cart.favorites)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.data)

  React.useEffect(() => {
    dispatch(CartUtils.favorites())
  }, [user])

  return (
    <Layout>
      <User allowGuest>
        <Favorites favorites={favorites} />
      </User>
    </Layout>
  )
}

const Favorites = ({ favorites }) => {
  return (
    <div className="items-center md:flex-row flex-wrap md:space-x-3">
      {favorites.map((order: StrapiOrder) => (
        <Favorite key={order.id} order={order} />
      ))}
    </div>
  )
}

const Favorite = ({ order }: { order: StrapiOrder }) => {
  const analytics = useAnalytics()
  const [edit, setEdit] = React.useState(false)
  const dispatch = useDispatch()

  const { product } = order

  const onEdit = () => {
    dispatch(CartUtils.favorites())
  }

  return (
    <div className="flex-row w-96 space-x-1 h-72">
      <div className="relative w-48 h-64">
        <Link href={`/shop/${product.designer?.slug}/${product.slug}`}>
          <a
            className="absolute inset-0"
            onClick={() =>
              analytics.logEvent('select_item', {
                type: 'products.select-item',
              })
            }
          >
            <ProductImages product={product} />
          </a>
        </Link>
      </div>
      <div className="items-start justify-between h-64">
        <ProductInfo product={product} />
        <div className="items-start space-y-2">
          <button
            type="button"
            className="underline"
            onClick={() => setEdit(true)}
          >
            add to cart
          </button>
          <button
            type="button"
            className="underline"
            onClick={async () => {
              await removeOrderItem({ dispatch, order, analytics })
              await dispatch(CartUtils.favorites())
            }}
          >
            remove
          </button>
        </div>
      </div>
      <EditCartItem
        order={order}
        isOpen={edit}
        close={() => setEdit(false)}
        onSubmit={onEdit}
      />
    </div>
  )
}

export default Page
