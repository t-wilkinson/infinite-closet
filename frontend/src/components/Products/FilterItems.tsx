import React from 'react'
import debounce from 'lodash/debounce'

import { Icon, CheckBox } from '@/components'
import { useSelector } from '@/utils/store'
import useFields from '@/Form/useFields'
import { Input } from '@/Form'

import { filterData } from './constants'
import { Filter } from './types'

type FilterItems = {
  [key in Filter]: (props: {
    filter: Filter
    panel: { values: string[]; toggle: (payload: string) => void }
  }) => any
}

export const FilterItems: FilterItems = {
  Designers: ({ panel }) => {
    const designers = useSelector((state) => state.layout.data.designers)
    const [matches, setMatches] = React.useState<number[]>([])
    const debounceMatches = React.useCallback(
      debounce(
        (search: string, designers: { slug: string; name: string }[]) => {
          fuzzySearch(
            search,
            designers.map((designer) => designer.name),
          ).then((matches) => setMatches(matches))
        },
        300,
      ),
      [],
    )

    const form = useFields({
      search: {
        label: 'Designer Names',
        onChange: (value) => debounceMatches(value, designers),
      },
    })
    const useMatches = matches.length > 0 || form.search.value
    const matchedIndexes = useMatches
      ? matches
      : designers.map((_: unknown, i: number) => i)

    return (
      <>
        <Input {...form.search} className="w-full">
          <div className="absolute right-0 top-0 bottom-0 justify-center mr-2 pointer-events-none">
            <Icon name="search" size={20} />
          </div>
        </Input>
        {matchedIndexes.map((index: number) => {
          const { slug, name } = designers[index]
          return (
            <CheckBox
              key={slug}
              setState={() => panel.toggle(slug)}
              state={panel.values.includes(slug)}
              p="sm"
            >
              <span>&nbsp;&nbsp;{name}</span>
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
}
export default FilterItems

/*
 * iterate through each keyword, removing keyword if exists.
 * if replacement was made, continue, otherwise, short-circuit
 * compare to `emptyRegExp' because this will not affect `newName.length'
 */
async function fuzzySearch(search: string, values: string[]) {
  const emptyRegExp = String(new RegExp('', 'i'))
  const keywords: RegExp[] = search
    .replace(/[^a-zA-Z0-9_\s]/g, '')
    .split(/\s+/g)
    .map((v) => new RegExp(v, 'i'))

  const matches = values.reduce((acc: number[], value, index) => {
    const keywordsFound =
      null !==
      keywords.reduce((name: string | null, keyword) => {
        if (name === null) return null
        if (String(keyword) === emptyRegExp) return name
        const newName = name.replace(keyword, '')
        return newName.length === name.length ? null : newName
      }, value)
    if (keywordsFound) acc.push(index)
    return acc
  }, [])

  return matches || []
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
