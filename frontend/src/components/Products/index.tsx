import React from 'react'
import { useRouter } from 'next/router'

import { Icon, ScrollUp } from '@/components'
import { useDispatch, useSelector } from '@/utils/store'

import { Crumbs } from './BreadCrumbs'
import { QUERY_LIMIT } from './constants'
import { productsActions } from './slice'
import Filters, { FiltersCount, useToggleFilter } from './Filters'
import ProductItems from './ProductItems'
import Sort from './Sort'

export const Products = ({ data, loading }) => {
  return (
    <div className="items-center w-full">
      <div className="flex-row w-full max-w-screen-xl h-full px-1 px-4 xl:px-0">
        <Filters />
        <div className="w-2" />
        <ProductItemsWrapper data={data} loading={loading} />
      </div>
      <ScrollUp />
      <div className="mb-4" />
    </div>
  )
}
export default Products

const ProductItemsWrapper = ({ data, loading }) => {
  const totalPages = Math.ceil(data.productsCount / QUERY_LIMIT) || 1
  const sortBy = useSelector((state) => state.products.panel.sortBy)

  return (
    <div className="w-full flex-shrink">
      <Header data={data} totalPages={totalPages} sortBy={sortBy} />
      <ProductItems data={data} loading={loading} />
      <Footer totalPages={totalPages} />
    </div>
  )
}

const Header = ({ data, totalPages, sortBy }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const slug = router.query.slug as string[]

  return (
    <div className="mb-4">
      <div className="sm:hidden">
        <Crumbs slug={slug} />
      </div>

      <div className="sm:flex-row items-end sm:items-center justify-between w-full">
        <span className="font-subheader text-xl self-start sm:self-center">
          {router.query.slug.slice(-1)[0]} ({data.productsCount})
        </span>
        <div className="flex-row space-x-1 items-center mb-1 md:mb-0">
          <div className="flex-row sm:hidden justify-end py-2">
            <button
              onClick={() => {
                dispatch(productsActions.togglePanel())
              }}
            >
              <div className="flex-row items-center">
                <div className="hidden md:flex">
                  <Icon name="settings" size={14} />
                </div>
                <div className="md:hidden">
                  <Icon name="settings" size={18} />
                </div>
                <div className="w-1" />
                <FiltersCount className="text-lg" />
              </div>
            </button>
          </div>

          <Sort sortBy={sortBy} />
          <PageNavigation totalPages={totalPages} />
        </div>
      </div>
      <div className="mt-4">
        <QuickFilter data={data} />
      </div>
    </div>
  )
}

const QuickFilter = ({ data }) => {
  const panel = useSelector((state) => state.products.panel)
  const toggleFilter = useToggleFilter()

  return (
    <div className="space-x-2 flex-row">
      {Object.entries(panel.filters)
        .map(([key, slugs]) =>
          slugs.map((slug) => {
            let filter
            if (key === 'sizes') {
              filter = data[key].find((filter) => filter === slug)
            } else {
              filter = data[key].find((filter) => filter.slug === slug)
            }

            return (
              <button
                key={slug}
                className="bg-gray-light px-3 py-1 rounded-full flex flex-row items-center space-x-2 text-sm"
                onClick={() => toggleFilter(key, slug)}
              >
                <span>{filter?.name || filter}</span>
                <Icon name="close" size={8} className="mt-1" />
              </button>
            )
          })
        )
        .flat()}
    </div>
  )
}

const Footer = ({ totalPages }) => (
  <div className="mt-4">
    <PageNavigation totalPages={totalPages} />
  </div>
)

const PageNavigation = ({ totalPages, ...props }) => {
  const router = useRouter()
  const pageNumber = Number(router.query.page) || 1

  React.useEffect(() => {
    if (pageNumber > totalPages) {
      document.getElementById('_app').scrollTo({ top: 0 })
      router.push({
        pathname: router.pathname,
        query: { ...router.query, page: 1 },
      })
    }
  }, [pageNumber, totalPages])

  return (
    <div className="flex-row items-center justify-end" {...props}>
      <button
        onClick={() => {
          const page = pageNumber > 1 ? pageNumber - 1 : pageNumber
          if (page !== pageNumber) {
            document.getElementById('_app').scrollTo({ top: 0 })
            router.push({
              pathname: router.pathname,
              query: { ...router.query, page },
            })
          }
        }}
      >
        <div className="hidden md:flex p-1 border border-gray-light rounded-sm">
          <Icon name="left" size={16} />
        </div>
        <div className="md:hidden p-2 border border-gray-light rounded-sm">
          <Icon name="left" size={20} />
        </div>
      </button>
      <span className="mx-1 text-lg">
        {pageNumber} / {totalPages}
      </span>
      <button
        onClick={() => {
          const page = pageNumber < totalPages ? pageNumber + 1 : pageNumber
          if (page !== pageNumber) {
            document.getElementById('_app').scrollTo({ top: 0 })
            router.push({
              pathname: router.pathname,
              query: { ...router.query, page },
            })
          }
        }}
      >
        <div className="hidden md:flex p-1 border border-gray-light rounded-sm">
          <Icon name="right" size={16} />
        </div>
        <div className="md:hidden p-2 border border-gray-light rounded-sm">
          <Icon name="right" size={20} />
        </div>
      </button>
    </div>
  )
}
