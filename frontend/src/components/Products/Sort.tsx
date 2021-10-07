import React from 'react'
import { useRouter } from 'next/router'

import { Icon } from '@/components'
import { useSelector, useDispatch } from '@/utils/store'

import { productsActions, productsSelectors } from './slice'
import { sortData } from './constants'
import { SortBy } from './types'
import { iconSort } from '@/components/Icons'

export const Sort = ({ sortBy }: { sortBy: SortBy }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <div
      className="mr-2 relative z-10"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button>
        <div
          className={`flex-row items-center border-l border-r border-t p-2 relative text-lg
         ${hover ? 'border-gray-light' : 'border-transparent'}`}
        >
          <div className="hidden md:flex">
            <Icon icon={iconSort} size={14} />
          </div>
          <div className="md:hidden">
            <Icon icon={iconSort} size={18} />
          </div>
          <div className="w-1" />
          <span className="whitespace-no-wrap">Sort By</span>
          <div
            className={`absolute left-0 bottom-0 -mb-px z-20 h-px w-full
              ${hover ? 'bg-white' : 'bg-transparent'}
            `}
          />
        </div>
      </button>

      <DropDown hover={hover} sortBy={sortBy} />
    </div>
  )
}

const DropDown = ({ hover, sortBy }) => {
  const panel = useSelector((state) => productsSelectors.panelSelector(state))
  const dispatch = useDispatch()
  const router = useRouter()

  const sortByField = (field: SortBy) => {
    let query = router.query
    if (panel.open) {
      dispatch(productsActions.setPanelSortBy(field as SortBy))
    } else {
      if (field === 'Alphabetical') delete query.sort
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
    hover && (
      <div
        className={`p-2 left-0 w-48 items-start absolute bottom-0 transform translate-y-full bg-white
        border-l border-b border-r border-t
        ${hover ? 'border-gray-light' : 'border-transparent'}
        `}
      >
        {Object.entries(sortData).map(([field, { name }]) => (
          <div key={field} className="my-1">
            <button onClick={() => sortByField(field as SortBy)}>
              <div className="items-start w-full">
                <span
                  className={`text-left
                    ${sortBy === field ? 'font-bold' : 'font-normal'}
                  `}
                >
                  {name}
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    )
  )
}

export default Sort
