import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { Divider } from '@/components'
import { useSelector, useDispatch } from '@/utils/store'
import { routes } from '@/utils/constants'

import { FILTERS_ASIDE_WIDTH, filtersByRoute, filterData } from './constants'
import { productsActions, productsSelectors } from './slice'
import { Filter } from './types'
import FilterItems from './FilterItems'

export const Filters = ({}) => {
  const router = useRouter()
  const routeName = router.query.slug[0]
  const dispatch = useDispatch()

  return (
    <FiltersWrapper>
      <div className="h-full w-full justify-start pl-4 bg-white">
        <div className="items-center">
          <BreadCrumbs />
          <FilterHeader />
          <Divider />
        </div>
        {filtersByRoute[routeName].map((filter: Filter) => (
          <FilterWrapper
            key={filter}
            filter={filter}
            Filter={FilterItems[filter]}
            selectFilter={() => dispatch(productsActions.focusFilter(filter))}
          />
        ))}
        <FilterFooter />
      </div>
    </FiltersWrapper>
  )
}

const FiltersWrapper = ({ children }) => {
  const isOpen = useSelector((state) => productsSelectors.isPanelOpen(state))

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 sm:hidden z-20 ">{children}</div>
      )}
      <div
        className="hidden w-1/4 sm:flex"
        style={{ minWidth: FILTERS_ASIDE_WIDTH }}
      >
        {children}
      </div>
    </>
  )
}

export default Filters

const BreadCrumbs = ({}) => {
  const slug = useRouter().query.slug as string[]

  return (
    <div className="items-start mb-2 w-full px-1 hidden sm:flex">
      <span className="mb-4">
        <span>{slug.join(' / ')}</span>
      </span>
      {routes
        .find((el) => el.value === slug[0])
        ?.data[0].data.map((el: { label: string; href: string }) => (
          <Link key={el.label} href={el.href}>
            <span className="cursor-pointer hover:underline mb-1">
              {el.label}
            </span>
          </Link>
        ))}
    </div>
  )
}

const FilterHeader = () => {
  const router = useRouter()

  return (
    <div className="flex-row items-end justify-between w-full my-4 px-4">
      <FiltersCount className="text-2xl font-subheader" />
      <button
        onClick={() => {
          router.push({
            pathname: router.pathname,
            query: { slug: router.query.slug },
          })
        }}
      >
        <span className="underline"> clear all </span>
      </button>
    </div>
  )
}

const FilterWrapper = ({ selectFilter, filter, Filter }) => {
  const panel = usePanel(filter)
  const selected = useSelector((state) =>
    productsSelectors.isFilterSelected(state, filter),
  )
  const numToggled = useSelector((state) =>
    productsSelectors.numToggledFilter(state, filter),
  )

  return (
    <>
      <div>
        <button onClick={() => selectFilter()}>
          <div className="flex-row items-center justify-between p-4">
            <span
              className={`uppercase ${selected ? 'font-bold' : 'font-normal'}`}
            >
              {filterData[filter].label ?? filter}
              {numToggled > 0 && ` (${numToggled})`}
            </span>
            <Image
              src={selected ? '/icons/down-arrow.svg' : '/icons/up-arrow.svg'}
              width={12}
              height={12}
            />
          </div>
        </button>
        <div className={`bg-gray-light p-4 ${selected ? 'flex' : 'hidden'}`}>
          <Filter key={filter} filter={filter} panel={panel} />
        </div>
      </div>
      <Divider />
    </>
  )
}

const FilterFooter = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const panel = useSelector((state) => productsSelectors.panelSelector(state))

  return (
    <div className="sm:hidden p-4 flex-row w-full">
      <button
        className="flex-grow bg-pri-light p-4 text-white"
        onClick={() => {
          dispatch(productsActions.closePanel())

          // turn panel filters into query
          let filters = Object.entries(filterData).reduce(
            (acc, [filter, { filterName }]) => {
              if (filterName) acc[filterName] = panel.filters[filter]
              return acc
            },
            {} as any,
          )
          if (panel.sortBy) filters.sort = panel.sortBy

          router.push({
            pathname: router.pathname,
            query: {
              ...router.query,
              ...filters,
            },
          })
        }}
      >
        Apply
      </button>

      <div className="w-4" />

      <button
        className="flex-grow bg-white border p-4"
        onClick={() => {
          dispatch(productsActions.closePanel())
        }}
      >
        Close
      </button>
    </div>
  )
}

export const FiltersCount = (props: any) => {
  const numToggled = useSelector((state) => productsSelectors.numToggled(state))
  return <span {...props}>Filters{numToggled > 0 && ` (${numToggled})`}</span>
}

// passed to each filter which manages query params and filter values
const usePanel = (filter: Filter) => {
  const router = useRouter()
  const panel = useSelector((state) => productsSelectors.panelSelector(state))
  const dispatch = useDispatch()

  // TODO: this only updates ui after fetching new data. Can we update ui before? Is this wise/necessary?
  const toggle = (payload: string) => {
    let values = new Set(panel.filters[filter])
    values.has(payload) ? values.delete(payload) : values.add(payload)
    if (panel.open) {
      dispatch(
        productsActions.setPanelFilter({ filter, payload: Array.from(values) }),
      )
    } else {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          [filterData[filter].filterName]: Array.from(values),
        },
      })
    }
  }

  // check if panel is open and if so pass those values in
  return {
    values: panel.filters[filter],
    toggle,
  }
}
