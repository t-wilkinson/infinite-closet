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
    <div className="items-center flex-row flex-wrap">
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
    <div className="w-1/2 md:w-1/3 pb-8">
      <div className="relative w-full h-64">
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
      <div className="w-full items-start justify-between">
        <ProductInfo product={product} />
        <div className="items-start mt-2">
          <EditOrderButton label="add to cart" onClick={() => setEdit(true)} />
          <EditOrderButton label="remove" onClick={async () => {
              await removeOrderItem({ dispatch, order, analytics })
              await dispatch(CartUtils.favorites())
            }} />
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

const EditOrderButton = ({ onClick, label }) =>
  <button
    type="button"
    className="underline"
    onClick={onClick}
  >
    {label}
  </button>

export default Page
