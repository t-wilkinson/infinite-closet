import React from 'react'
import Link from 'next/link'

import useAnalytics from '@/utils/useAnalytics'
import { ProductImages, ProductInfo } from '@/Products/ProductItems'
import { EditCartItem, removeOrderItem } from '@/Cart'
import { useDispatch } from '@/utils/store'
import { CartUtils } from '@/Cart/slice'
import { StrapiOrder } from '@/types/models'

export const Favorite = ({ order }: { order: StrapiOrder }) => {
  const [edit, setEdit] = React.useState(false)
  const analytics = useAnalytics()
  const dispatch = useDispatch()

  const { product } = order

  const onEdit = () => {
    dispatch(CartUtils.favorites())
  }

  const remove = async () => {
    await removeOrderItem({ dispatch, order, analytics })
    await dispatch(CartUtils.favorites())
  }

  return (
    <>
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
      <div className="w-full items-start justify-between flex-row sm:flex-col">
        <ProductInfo product={product} />
        <div className="items-end sm:items-start mt-2 w-full">
          <EditOrderButton label="add to cart" onClick={() => setEdit(true)} />
          <EditOrderButton label="remove" onClick={remove} />
        </div>
      </div>
      <EditCartItem
        order={order}
        isOpen={edit}
        close={() => setEdit(false)}
        onSubmit={onEdit}
      />
    </>
  )
}

const EditOrderButton = ({ onClick, label }) => (
  <button type="button" className="underline" onClick={onClick}>
    {label}
  </button>
)
