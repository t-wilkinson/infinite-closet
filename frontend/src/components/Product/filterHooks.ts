import { useRouter } from 'next/router'

import { useSelector, useDispatch } from '@/utils/store'

import { productsActions, productsSelectors } from '@/Product/slice'
import { toggleFilter, useFilterName, usePanel } from '@/Product/Filter/filterHooks'
import { Filter } from '@/Product/Filter/types'

export const useToggleFilter = ({panel}) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const setPanelFilter = ({ filter, values}) => dispatch(
    productsActions.setPanelFilter({ filter, payload: Array.from(values) })
  )

  return (filter: Filter, slug: string) =>
    toggleFilter({
      setPanelFilter,
      slug,
      router,
      panel,
      filter,
    })
}

// passed to each filter which manages query params and filter values
const useProductPanel = (filterName: Filter) => {
  const dispatch = useDispatch()
  const panel = useSelector((state) => productsSelectors.panelSelector(state))
  return usePanel({
    values: panel.filters[filterName],
    filterName,
    toggleFilter: useToggleFilter({panel}),
    setPanelFilter: ({ filter, payload}) => dispatch(productsActions.setPanelFilter({ filter, payload}))
  })
}

export const useProductFilterPanel = () => {
  const dispatch = useDispatch()
  const isOpen = useSelector((state) => state.products.panel.open)
  const categories = useSelector((state) => state.layout.data.categories)
  const closePanel = () => dispatch(productsActions.closePanel())

  return {
    isOpen,
    categories,
    closePanel,
    useFilterName: (filterName: Filter) => {
      const selected = useSelector((state) => productsSelectors.isFilterSelected(state, filterName))
      const numToggled = useSelector((state) => productsSelectors.numToggledFilter(state, filterName))
      const data = useSelector((state) => state.layout.data)[filterName]
      return useFilterName({
        filterName, selected, numToggled, data,
        panel: useProductPanel(filterName),
        selectFilter: () => dispatch(productsActions.toggleFilter(filterName)),
      })
    },
  }
}
