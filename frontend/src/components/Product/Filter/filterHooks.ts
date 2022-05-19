import { useRouter } from 'next/router'

import { useSelector } from '@/utils/store'

import { Filter } from './types'
import FilterItems from './FilterItems'

export const toggleFilter = ({ setPanelFilter, panel, filter, router, slug }) => {
  let values = new Set<string>(panel.filters[filter])
  values.has(slug) ? values.delete(slug) : values.add(slug)
  setPanelFilter({ filter, values})
  router.push({
    pathname: router.pathname,
    query: {
      ...router.query,
      [filter]: Array.from(values),
    },
  })
}

// passed to each filter which manages query params and filter values
export const usePanel = ({values, filterName, toggleFilter, setPanelFilter}) => {
  const router = useRouter()
  const filterData = useSelector((state) => state.layout.data[filterName])

  const set = (payload: string[]) => {
    setPanelFilter({ filter: filterName, payload: payload })
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        [filterName]: payload,
      },
    })
  }

  return {
    data: filterData,
    values,
    toggle: (payload) => toggleFilter(filterName, payload),
    set,
  }
}

export const useFilterName = ({
  filterName,
  selected,
  numToggled,
  data,
  selectFilter,
  panel,
}: {
  filterName: Filter
  selected: boolean
  numToggled: number
  data: any
  selectFilter: () => void
  panel: any
}) => {
  const Filter = FilterItems[filterName]

  return {
    Filter,
    panel,
    selected,
    numToggled,
    data,
    name: filterName,
    selectFilter,
  }
}

