import React from 'react'
import { useRouter } from 'next/router'

import { Icon } from '@/components'
import { useSelector, useDispatch } from '@/utils/store'

import { productsActions, productsSelectors } from './slice'
import { sortData } from './constants'
import { SortBy } from './types'

export const Sort = ({ sortBy }: { sortBy: SortBy }) => {
  const [focused, setFocused] = React.useState(false)
  const [hover, setHover] = React.useState(false)

  return (
    <div
      className="mr-2 relative z-10"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        onClick={() => setFocused(!focused)}
        onBlur={() => setFocused(false)}
      >
        <div
          className={`flex-row items-center border-l border-r border-t p-2 relative
         ${hover ? 'border-gray' : 'border-transparent'}`}
        >
          <Icon name="sort" size={14} />
          <div className="w-1" />
          <span>Sort By</span>
          <div
            className={`absolute left-0 bottom-0 -mb-px z-20 h-px w-full ${
              hover ? 'bg-white' : 'bg-transparent'
            }`}
          />
        </div>
      </button>

      <DropDown focused={false} hover={hover} sortBy={sortBy} />
    </div>
  )
}
export default Sort

const DropDown = ({ focused, hover, sortBy }) => {
  const panel = useSelector((state) => productsSelectors.panelSelector(state))
  const dispatch = useDispatch()
  const router = useRouter()

  const sortByField = (field: SortBy) => {
    let query = router.query
    if (panel.open) {
      dispatch(productsActions.setPanelSortBy(field as SortBy))
    } else {
      if (field === 'Recommended') delete query.sort
      else query.sort = field

      router.push({
        pathname: router.pathname,
        query: {
          ...query,
        },
      })
    }
  }

  return (
    (focused || hover) && (
      <div
        className={`p-2 left-0 w-48 items-start absolute bottom-0 transform translate-y-full bg-white
        border-l border-b border-r border-t ${
          hover ? 'border-gray' : 'border-transparent'
        }`}
      >
        {Object.entries(sortData).map(([field, { label }]) => (
          <div key={field} className="my-1">
            <button onClick={() => sortByField(field as SortBy)}>
              <div className="items-start w-full">
                <span
                  className={`text-left ${
                    sortBy === field ? 'font-bold' : 'font-normal'
                  }`}
                >
                  {label}
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    )
  )
}
