import React from 'react'
import { useRouter } from 'next/router'

import { Icon, ScrollUp } from '@/components'
import { useDispatch, useSelector } from '@/utils/store'
import { capitalize } from '@/utils/helpers'

import { Crumbs } from './BreadCrumbs'
import { QUERY_LIMIT } from './constants'
import { productsActions } from './slice'
import Filters, { FiltersCount, useToggleFilter } from './Filters'
import ProductItems from './ProductItems'
import Sort from './Sort'
import styles from './Products.module.css'
import { iconSettings } from '@/components/Icons'
import { iconClose } from '@/components/Icons'
import { iconLeft } from '@/components/Icons'
import { iconRight } from '@/components/Icons'

export const Products = ({ data, loading }) => {
  return (
    <div className="items-center w-full">
      <div className="flex-row w-full max-w-screen-xl h-full md:px-4 xl:px-0">
        <Filters />
        <div className="hidden md:block w-2" />
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
      <HeaderWrapper data={data} totalPages={totalPages} sortBy={sortBy} />
      <ProductItems data={data} loading={loading} />
      <Footer totalPages={totalPages} />
    </div>
  )
}

const HeaderWrapper = ({ data, totalPages, sortBy }) => {
  const router = useRouter()
  const slug = router.query.slug as string[]

  return (
    <div className="mx-2 md:mx-0 mb-4">
      <div className="sm:flex-row items-end sm:items-center justify-between w-full">
        <div className="flex-row justify-between w-full sm:w-auto items-end">
          <div className="sm:hidden">
            <Crumbs slugs={slug} />
          </div>
          <span className="hidden sm:inline font-bold text-xl self-start sm:self-center">
            {capitalize(router.query.slug.slice(-1)[0])} ({data.productsCount})
          </span>
        </div>
        <Header totalPages={totalPages} sortBy={sortBy} />
      </div>
      <div className="mt-4">
        <QuickFilter data={data} />
      </div>
    </div>
  )
}

const Header = ({ sortBy, totalPages }) => {
  const dispatch = useDispatch()
  const [sticky, setSticky] = React.useState(false)
  const ref = React.useRef(null)

  React.useEffect(() => {
    const header = ref.current
    const app = document.getElementById('_app')
    if (!header || !app) {
      return
    }

    const stickyScroll = () => {
      if (app.scrollTop > header.offsetTop) {
        setSticky(true)
      } else {
        setSticky(false)
      }
    }
    const toggleStickyScroll = () => {
      if (window.innerWidth > 640) {
        setSticky(false)
        app.removeEventListener('scroll', stickyScroll)
      } else {
        app.addEventListener('scroll', stickyScroll)
      }
    }

    toggleStickyScroll()
    window.addEventListener('resize', toggleStickyScroll)
    return () => {
      app.removeEventListener('scroll', stickyScroll)
      window.removeEventListener('resize', toggleStickyScroll)
    }
  }, [ref])

  return (
    <div
      ref={ref}
      className={`flex-row space-x-1 items-center mb-1 md:mb-0 z-10
        ${sticky ? styles.sticky : ''}`}
    >
      <div className="flex-row sm:hidden py-2 justify-end">
        <button
          onClick={() => {
            dispatch(productsActions.togglePanel())
          }}
        >
          <div className="flex-row items-center">
            <div className="hidden md:flex">
              <Icon icon={iconSettings} size={14} />
            </div>
            <div className="md:hidden">
              <Icon icon={iconSettings} size={18} />
            </div>
            <div className="w-1" />
            <FiltersCount className="whitespace-no-wrap" />
          </div>
        </button>
      </div>
      <Sort sortBy={sortBy} />
      <div className="w-full">
        <PageNavigation totalPages={totalPages} />
      </div>
    </div>
  )
}

const QuickFilter = ({ data }) => {
  const panel = useSelector((state) => state.products.panel)
  const toggleFilter = useToggleFilter()

  return (
    <div className="space-x-2 flex-row flex-wrap space-y-2">
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
                <Icon icon={iconClose} size={8} className="mt-1" />
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

  const changePage = (page: number) => {
    if (page !== pageNumber) {
      document.getElementById('_app').scrollTo({ top: 0 })
      router.push({
        pathname: router.pathname,
        query: { ...router.query, page },
      })
    }
  }

  React.useEffect(() => {
    if (pageNumber > totalPages) {
      changePage(1)
    }
  }, [pageNumber, totalPages])

  const decreasePageNumber = () => {
    changePage(pageNumber > 1 ? pageNumber - 1 : pageNumber)
  }

  const increasePageNumber = () => {
    changePage(pageNumber < totalPages ? pageNumber + 1 : pageNumber)
  }

  return (
    <div className="flex-row items-center justify-end" {...props}>
      <button
        onClick={decreasePageNumber}
        className={`
          ${pageNumber === 1 ? 'text-gray cursor-default' : ''}
          `}
      >
        <div className="md:flex p-1 border border-gray-light rounded-sm">
          <Icon icon={iconLeft} className="w-4 h-4 md:w-4 md:h-4" />
        </div>
      </button>
      <span className="mx-1 text-lg whitespace-no-wrap">
        {pageNumber} / {totalPages}
      </span>
      <button
        onClick={increasePageNumber}
        className={`
          ${pageNumber >= totalPages ? 'text-gray cursor-default' : ''}
          `}
      >
        <div className="md:flex p-1 border border-gray-light rounded-sm">
          <Icon icon={iconRight} className="w-4 h-4" />
        </div>
      </button>
    </div>
  )
}
