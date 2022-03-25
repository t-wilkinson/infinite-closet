import React from 'react'
import Link from 'next/link'

import { useDispatch, useSelector } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'
import { StrapiOrder } from '@/types/models'

import { Divider } from '@/Components'
import Carousel from '@/Layout/Carousel'
import { ProductImages, ProductInfo } from '@/Product/ProductItem'
import { EditCartItem } from '@/Order/Cart'
import { removeOrderItem, OrderUtils } from '@/Order'
export * from './api'

export const Favorite = ({ order }: { order: StrapiOrder }) => {
  const [edit, setEdit] = React.useState(false)
  const analytics = useAnalytics()
  const dispatch = useDispatch()

  const { product } = order

  const onEdit = () => {
    dispatch(OrderUtils.favorites())
  }

  const remove = async () => {
    await removeOrderItem({ dispatch, order, analytics })
    await dispatch(OrderUtils.favorites())
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

export const Favorites = () => {
  const favorites = useSelector((state) => state.orders.favorites)
  const ref = React.useRef(null)
  const [width, setWidth] = React.useState(window.innerWidth)

  React.useEffect(() => {
    const onResize = () => {
      const clientWidth = ref.current?.clientWidth
      if (clientWidth) {
        setWidth(clientWidth)
      }
    }

    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (favorites?.length === 0) {
    return null
  }

  return (
    <section
      className="pt-12"
      ref={ref}
      style={{
        flex: '1 0 auto',
      }}
    >
      <h3 className="font-subheader text-2xl">Favourites</h3>
      <Divider />
      <div className="h-8" />
      <Carousel
        pageSize={width < 470 ? 1 : width < 610 ? 2 : width < 1000 ? 3 : 4}
        // pageSize={Math.floor((width + 100) / 320)}
        Renderer={Favorite}
        riders={favorites}
        map={(favorite) => ({ order: favorite })}
        inner={{
          style: {
            flex: '1 0 auto',
          },
        }}
      />
    </section>
  )
}
