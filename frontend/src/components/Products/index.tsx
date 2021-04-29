import React from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

import { ScrollUp, Icon } from '@/components'
import { useDispatch, useSelector } from '@/utils/store'

import { Crumbs } from './BreadCrumbs'
import { QUERY_LIMIT } from './constants'
import { productsSelectors, productsActions } from './slice'
import Filters, { FiltersCount } from './Filters'
import ProductItems from './ProductItems'
import Sort from './Sort'

export const Products = () => {
  return (
    <div className="items-center">
      <div className="flex-row w-full max-w-screen-xl h-full px-1 sm:px-4">
        <Filters />
        <ProductItemsWrapper />
      </div>
      <ScrollUp />
      <div className="mb-4" />
    </div>
  )
}
export default Products

const ProductItemsWrapper = () => {
  const data = useSelector((state) => productsSelectors.data(state))
  const router = useRouter()
  const totalPages = Math.ceil(data.productsCount / QUERY_LIMIT) || 1
  const sortBy = useSelector((state) => productsSelectors.panelSortBy(state))
  const loading = useSelector((state) => productsSelectors.loading(state))

  return (
    <div className="w-full">
      <Header
        router={router}
        data={data}
        totalPages={totalPages}
        sortBy={sortBy}
      />
      <ProductItems data={data} loading={loading} />
      <Footer totalPages={totalPages} />
    </div>
  )
}

const Header = ({ router, data, totalPages, sortBy }) => {
  const dispatch = useDispatch()
  const slug = useRouter().query.slug as string[]

  return (
    <div className="mb-4 border-b border-gray">
      <div className="sm:hidden">
        <Crumbs slug={slug} />
      </div>

      <div className="sm:flex-row items-end sm:items-center justify-between w-full">
        <span className="font-subheader text-xl self-start sm:self-center">
          {router.query.slug[0]} ({data.productsCount})
        </span>
        <div className="flex-row space-x-1">
          <div className="flex-row sm:hidden justify-end py-2">
            <button
              onClick={() => {
                dispatch(productsActions.togglePanel())
              }}
            >
              <div className="flex-row items-center">
                <Icon size={14} name="settings" />
                <div className="w-1" />
                <FiltersCount />
              </div>
            </button>
          </div>

          <Sort sortBy={sortBy} />
          <PageNavigation totalPages={totalPages} />
        </div>
      </div>
    </div>
  )
}

const Footer = ({ totalPages }) => (
  <div className="mt-4">
    <PageNavigation totalPages={totalPages} />
  </div>
)

const PageNavigation = ({ totalPages, ...props }) => {
  const pageNumber = useSelector((state) => productsSelectors.pageNumber(state))
  const dispatch = useDispatch()

  return (
    <div className="flex-row items-center justify-end" {...props}>
      <button onClick={() => dispatch(productsActions.decreasePageNumber())}>
        <div className="p-1 border border-gray-light">
          <Image src="/icons/left-arrow.svg" width={16} height={16} />
        </div>
      </button>
      <span className="mx-1">
        {pageNumber + 1} / {totalPages}
      </span>
      <button
        onClick={() => dispatch(productsActions.increasePageNumber(totalPages))}
      >
        <div className="p-1 border border-gray-light">
          <Image src="/icons/right-arrow.svg" width={16} height={16} />
        </div>
      </button>
    </div>
  )
}
