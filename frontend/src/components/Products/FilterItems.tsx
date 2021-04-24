import React from 'react'
// import debounce from 'lodash/debounce'

import { Icon, CheckBox } from '@/components'
import { useSelector, useDispatch } from '@/utils/store'

import { filterData } from './constants'
import { Filter } from './types'
import { productsActions } from './slice'

type ProductFilter = {
  [key in Filter]: (props: {
    filter: Filter
    panel: { values: string[]; toggle: (payload: string) => void }
  }) => any
}

export const productFilter: ProductFilter = {
  Designers: ({ panel, filter }) => {
    const dispatch = useDispatch()
    // TODO
    const state = useSelector((state) => state.products.Designers)
    const setState = (field: string, value: any) =>
      dispatch(
        productsActions.setFilterState({
          filter,
          field,
          payload: value,
        }),
      )

    const designers = []
    const debounceMatches = React.useCallback(
      // TODO
      (a, b, c) => {},
      // debounce(searchDesignerMatches, 300),
      [],
    )

    React.useEffect(() => {
      debounceMatches(
        (v: any) => setState('matches', v),
        state.search,
        designers,
      )
    }, [state.search])

    return (
      <>
        <div
          className={`border-b-2 flex-row items-center ${
            state.searchFocused ? 'border-sec-light' : 'border-gray-light'
          }`}
        >
          <div className="p-1">
            {/* <Ionicons name="search-outline" size={20} /> */}
          </div>
          <input
            autoFocus={true}
            placeholder="Designer"
            value={state.search}
            onChange={(e) => {
              setState('search', e.target.value)
            }}
            className="flex-grow p-1"
            onBlur={() => setState('searchFocused', false)}
            onFocus={() => setState('searchFocused', true)}
          />
        </div>
        {state.matches.map((_, index: number) => {
          const key = designers[index].name_uid
          return (
            <CheckBox
              key={key}
              setState={() => {
                panel.toggle(key)
              }}
              state={panel.values.includes(key)}
              p="sm"
            >
              <span>&nbsp;&nbsp;{designers[index].name}</span>
            </CheckBox>
          )
        })}
      </>
    )
  },

  Colors: ({ panel }) => {
    return (
      <>
        <div className="flex-row flex-wrap">
          {filterData.Colors.data.map((v) => (
            <div className="m-1" key={v.color}>
              <button
                onClick={() => {
                  panel.toggle(v.color)
                }}
              >
                <div
                  className="rounded-full w-8 h-8 items-center justify-center"
                  style={{
                    backgroundColor: v.value,
                  }}
                >
                  {panel.values.includes(v.color) && (
                    <Icon
                      name="check"
                      className="w-5 h-5"
                      style={{
                        color: pickFgColorFromBgColor(
                          v.value,
                          '#ffffff',
                          '#000000',
                        ),
                      }}
                    />
                  )}
                </div>
              </button>
            </div>
          ))}
        </div>
      </>
    )
  },

  DatesAvailable: () => (
    <>
      <span>Coming Soon...</span>
    </>
  ),

  Occasions: ({ filter, panel }) => (
    <>
      <FilterCheckBoxes filter={filter} panel={panel} />
    </>
  ),

  Favorites: () => (
    <>
      <span>Coming Soon...</span>
    </>
  ),

  Weather: ({ filter, panel }) => (
    <>
      <FilterCheckBoxes filter={filter} panel={panel} />
    </>
  ),

  Style: ({ filter, panel }) => {
    return (
      <>
        <FilterCheckBoxes filter={filter} panel={panel} />
      </>
    )
  },

  // TODO: or consider removing sort from filters.
}
export default productFilter

async function searchDesignerMatches(
  setMatches: (matches: any) => void,
  search: string,
  designers: { name_uid: string; name: string }[],
) {
  const emptyRegExp = String(new RegExp('', 'i'))
  const keywords: RegExp[] = search
    .replace(/[^a-zA-Z0-9_\s]/g, '')
    .split(/\s+/g)
    .map((v) => new RegExp(v, 'i'))

  /* iterate through each keyword, removing keyword if exists.
   * if replacement was made, continue, otherwise, short-circuit
   * compare to `emptyRegExp' because this will not affect `newName.length'
   */
  const matches = designers.reduce((acc: number[], designer, index) => {
    const keywordsFound =
      null !==
      keywords.reduce((name: string | null, keyword) => {
        if (name === null) return null
        if (String(keyword) === emptyRegExp) return name
        const newName = name.replace(keyword, '')
        return newName.length === name.length ? null : newName
      }, designer.name)
    if (keywordsFound) acc.push(index)
    return acc
  }, [])
  setMatches(matches ?? [])
}

const pickFgColorFromBgColor = (
  bgColor: string,
  lightColor: string,
  darkColor: string,
) => {
  /* https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color */
  let color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor
  let r = parseInt(color.substring(0, 2), 16) // hexToR
  let g = parseInt(color.substring(2, 4), 16) // hexToG
  let b = parseInt(color.substring(4, 6), 16) // hexToB
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor
}

const FilterCheckBoxes = ({ filter, panel }) => {
  return filterData[filter].data.map((v: { field: string; label: string }) => (
    <div key={v.field} className="py-1">
      <CheckBox
        setState={() => panel.toggle(v.field)}
        state={panel.values.includes(v.field)}
      >
        <span>&nbsp;&nbsp;{v.label}</span>
      </CheckBox>
    </div>
  ))
}
