import React from 'react'
import { useRouter } from 'next/router'

import { useSelector } from '@/utils/store'
import { Divider } from '@/Components'
import { Icon, iconUp, iconDown } from '@/Components/Icons'

import { BreadCrumbs } from '@/Product/BreadCrumbs'
import { filterData } from '@/Product/constants'
import { productsSelectors } from '@/Product/slice'

import { Filter } from './types'

export const Filters = ({
  href = '/products',
  filterPanel,
  filterNames,
}: {
  href?: string
  filterPanel: any
  filterNames: Filter[]
}) => {
  return (
    <div
      className={`h-full justify-start bg-white w-full sm:w-64 md:w-72
        overflow-y-auto
          ${
            filterPanel.isOpen
              ? 'fixed inset-0 sm:hidden z-20'
              : 'hidden w-full sm:flex'
          }
          `}
    >
      <div className="items-center">
        <BreadCrumbs href={href} categories={filterPanel.categories} />
        <FilterHeader />
        <Divider />
      </div>
      {filterNames.map((filterName: Filter) => {
        const filter = filterPanel.useFilterName(filterName)
        return <FilterWrapper key={filter.name} filter={filter} />
      })}
      <FilterFooter closePanel={filterPanel.closePanel} />
    </div>
  )
}

const FilterHeader = () => {
  const router = useRouter()

  return (
    <div className="flex-row items-end justify-between w-full my-4 px-2 flex-wrap">
      <FiltersCount className="text-2xl sm:text-lg font-bold" />
      <button
        onClick={() => {
          router.push({
            pathname: router.pathname,
            query: { slug: router.query.slug },
          })
        }}
      >
        <span className="underline sm:text-xs"> Clear all </span>
      </button>
    </div>
  )
}

const FilterWrapper = ({ filter }) => {
  if (filter.data?.length === 0) {
    return null
  }

  return (
    <>
      <button onClick={() => filter.selectFilter()}>
        <div className="flex-row text-lg sm:text-sm items-center justify-between py-4 px-2">
          <span className="font-bold">
            {filterData[filter.name].label ?? filter.name}
            {filter.numToggled > 0 && ` (${filter.numToggled})`}
          </span>
          <Icon icon={filter.selected ? iconUp : iconDown} size={12} />
        </div>
      </button>
      <div
        className={`p-4 text-lg sm:text-sm ${
          filter.selected ? 'flex' : 'hidden'
        }`}
      >
        <filter.Filter
          key={filter.name}
          filter={filter.name}
          panel={filter.panel}
        />
      </div>
      <Divider />
    </>
  )
}

const FilterFooter = ({ closePanel }) => {
  useRouter()
  // // For now filters in popup are instantly applied
  // const applyFilterPanel = () => {
  //   dispatch(productsActions.closePanel())

  //   // turn panel filters into query
  //   let filters = Object.keys(filterData).reduce((acc, filter) => {
  //     if (filter) acc[filter] = panel.filters[filter]
  //     return acc
  //   }, {} as any)
  //   if (panel.sortBy) filters.sort = panel.sortBy

  //   router.push({
  //     pathname: router.pathname,
  //     query: {
  //       ...router.query,
  //       ...filters,
  //     },
  //   })
  // }

  return (
    <div className="sm:hidden p-2 flex-row w-full">
      {/* <button */}
      {/*   className="flex-grow bg-pri p-4 text-white rounded-sm" */}
      {/*   onClick={applyFilterPanel} */}
      {/* > */}
      {/*   Apply */}
      {/* </button> */}
      {/* <div className="w-4" /> */}
      <button
        className="flex-grow bg-white border border-gray p-4 rounded-sm"
        onClick={() => closePanel()}
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

export default Filters
