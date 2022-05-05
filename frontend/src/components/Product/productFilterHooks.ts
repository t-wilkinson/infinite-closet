import { useRouter } from 'next/router'

import { useSelector, useDispatch } from '@/utils/store'

import { productsActions, productsSelectors } from './slice'
import { Filter } from './types'
import FilterItems from './FilterItems'

export const useProductFilter = (filterName: Filter) => {
  const Filter = FilterItems[filterName]
  const panel = usePanel(filterName)
  const selected = useSelector((state) =>
    productsSelectors.isFilterSelected(state, filterName)
  )
  const numToggled = useSelector((state) =>
    productsSelectors.numToggledFilter(state, filterName)
  )
  const data = useSelector((state) => state.layout.data)[filterName]
  const dispatch = useDispatch()

  return {
    Filter,
    panel,
    selected,
    numToggled,
    data,
    name: filterName,
    selectFilter: () => dispatch(productsActions.toggleFilter(filterName))
  }
}

const toggleFilter = ({ panel, filter, dispatch, router, slug }) => {
  let values = new Set<string>(panel.filters[filter])
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

// passed to each filter which manages query params and filter values
const usePanel = (filterName: Filter) => {
  const router = useRouter()
  const panel = useSelector((state) => productsSelectors.panelSelector(state))
  const dispatch = useDispatch()
  const toggleFilter = useToggleFilter()

  const set = (payload: string[]) => {
    dispatch(productsActions.setPanelFilter({ filter: filterName, payload: payload }))
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        [filterName]: payload,
      },
    })
  }

  return {
    values: panel.filters[filterName],
    toggle: (payload) => toggleFilter(filterName, payload),
    set,
  }
}

export default useProductFilter
