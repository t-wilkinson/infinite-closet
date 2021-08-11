import React from 'react'
import { useRouter } from 'next/router'

import { Icon, Divider } from '@/components'
import { useSelector, useDispatch } from '@/utils/store'

import { BreadCrumbs } from './BreadCrumbs'
import { filtersByRoute, filterData } from './constants'
import { productsActions, productsSelectors } from './slice'
import { Filter } from './types'
import FilterItems from './FilterItems'

export const Filters = ({}) => {
  const router = useRouter()
  const routeName = router.query.slug[0]
  const dispatch = useDispatch()
  const isOpen = useSelector((state) => state.products.panel.open)

  return (
    <div
      className={`h-full justify-start bg-white w-full sm:w-64 md:w-72
          ${isOpen ? 'fixed inset-0 sm:hidden z-20' : 'hidden w-full sm:flex'}
          `}
    >
      <div className="items-center">
        <BreadCrumbs />
        <FilterHeader />
        <Divider />
      </div>
      {filtersByRoute[routeName].map((filter: Filter) => (
        <FilterWrapper
          key={filter}
          filter={filter}
          selectFilter={() => dispatch(productsActions.focusFilter(filter))}
        />
      ))}
      <FilterFooter />
    </div>
  )
}

export default Filters

const FilterHeader = () => {
  const router = useRouter()

  return (
    <div className="flex-row items-end justify-between w-full my-4 px-2 flex-wrap">
      <FiltersCount className="text-2xl" />
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

const FilterWrapper = ({ selectFilter, filter }) => {
  const Filter = FilterItems[filter]
  const panel = usePanel(filter)
  const selected = useSelector((state) =>
    productsSelectors.isFilterSelected(state, filter)
  )
  const numToggled = useSelector((state) =>
    productsSelectors.numToggledFilter(state, filter)
  )

  return (
    <>
      <div>
        <button onClick={() => selectFilter()}>
          <div className="flex-row items-center justify-between py-4 px-2">
            <span className="font-bold">
              {filterData[filter].label ?? filter}
              {numToggled > 0 && ` (${numToggled})`}
            </span>
            <Icon name={selected ? 'down' : 'up'} size={12} />
          </div>
        </button>
        <div className={`p-4 ${selected ? 'flex' : 'hidden'}`}>
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
  const applyFilterPanel = () => {
    dispatch(productsActions.closePanel())

    // turn panel filters into query
    let filters = Object.keys(filterData).reduce((acc, filter) => {
      if (filter) acc[filter] = panel.filters[filter]
      return acc
    }, {} as any)
    if (panel.sortBy) filters.sort = panel.sortBy

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        ...filters,
      },
    })
  }

  return (
    <div className="sm:hidden p-2 flex-row w-full">
      <button
        className="flex-grow bg-pri p-4 text-white rounded-sm"
        onClick={applyFilterPanel}
      >
        Apply
      </button>
      <div className="w-4" />
      <button
        className="flex-grow bg-white border border-gray p-4 rounded-sm"
        onClick={() => dispatch(productsActions.closePanel())}
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

export const useToggleFilter = () => {
  const router = useRouter()
  const panel = useSelector((state) => productsSelectors.panelSelector(state))
  const dispatch = useDispatch()
  return (filter: Filter, slug: string) =>
    toggleFilter({
      slug,
      router,
      panel,
      dispatch,
      filter,
    })
}

export const toggleFilter = ({ panel, filter, dispatch, router, slug }) => {
  let values = new Set(panel.filters[filter])
  values.has(slug) ? values.delete(slug) : values.add(slug)
  dispatch(
    productsActions.setPanelFilter({ filter, payload: Array.from(values) })
  )
  router.push({
    pathname: router.pathname,
    query: {
      ...router.query,
      [filter]: Array.from(values),
    },
  })
}

// passed to each filter which manages query params and filter values
const usePanel = (filter: Filter) => {
  const router = useRouter()
  const panel = useSelector((state) => productsSelectors.panelSelector(state))
  const dispatch = useDispatch()
  const toggleFilter = useToggleFilter()

  const set = (payload: string[]) => {
    dispatch(productsActions.setPanelFilter({ filter, payload: payload }))
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        [filter]: payload,
      },
    })
  }

  return {
    values: panel.filters[filter],
    toggle: (payload) => toggleFilter(filter, payload),
    set,
  }
}
