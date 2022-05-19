import { useRouter } from 'next/router'

import { useSelector, useDispatch } from '@/utils/store'

import { toggleFilter, useFilterName, usePanel } from '@/Product/Filter/filterHooks'
import { Filter } from '@/Product/Filter/types'
import { wardrobeActions, wardrobeSelectors } from '@/Wardrobe/slice'

export const useToggleFilter = ({panel}) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const setPanelFilter = ({ filter, values}) => dispatch(
    wardrobeActions.setPanelFilter({ filter, payload: Array.from(values) })
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
const useWardrobePanel = (filterName: Filter) => {
  const dispatch = useDispatch()
  const panel = useSelector((state) => wardrobeSelectors.panelSelector(state))

  return usePanel({
    values: panel.filters[filterName],
    filterName,
    toggleFilter: useToggleFilter({panel}),
    setPanelFilter: ({ filter, payload}) => dispatch(wardrobeActions.setPanelFilter({ filter, payload}))
  })
}

export const useWardrobeFilterPanel = () => {
  const dispatch = useDispatch()
  const isOpen = useSelector((state) => state.wardrobe.panel.open)
  const categories = useSelector((state) => state.layout.data.categories)
  const closePanel = () => dispatch(wardrobeActions.closePanel())

  return {
    isOpen,
    categories,
    closePanel,
    useFilterName: (filterName: Filter) => {
      const selected = useSelector((state) => wardrobeSelectors.isFilterSelected(state, filterName))
      const numToggled = useSelector((state) => wardrobeSelectors.numToggledFilter(state, filterName))
      const data = useSelector((state) => state.layout.data)[filterName]
      const panel = useWardrobePanel(filterName)

      return useFilterName({
        filterName, selected, numToggled, data,
        panel,
        selectFilter: () => dispatch(wardrobeActions.toggleFilter(filterName)),
      })
    },
  }
}

