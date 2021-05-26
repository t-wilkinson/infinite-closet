import React from 'react'
import debounce from 'lodash/debounce'

import { Icon, CheckBox } from '@/components'
import { useSelector } from '@/utils/store'
import useFields from '@/Form/useFields'
import { Input } from '@/Form'
import {
  StrapiColor,
  StrapiOccasion,
  StrapiWeather,
  StrapiDesigner,
} from '@/utils/models'

import { Filter } from './types'

type FilterItems = {
  [key in Filter]: (props: {
    filter: Filter
    panel: { values: string[]; toggle: (payload: string) => void }
  }) => any
}

export const FilterItems: FilterItems = {
  Designers: ({ panel }) => {
    const designers = useSelector((state) =>
      Object.values(state.layout.data.designers),
    )
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
        <div className="h-64 justify-start">
          <Input {...form.search} className="w-full">
            <div className="justify-center pr-2 pointer-events-none h-full bg-white">
              <Icon name="search" size={20} />
            </div>
          </Input>
          <div className="h-full space-y justify-start overflow-y-scroll">
            {matchedIndexes.map((index: number) => {
              const { slug, name } = designers[index]
              return (
                <CheckBox
                  key={slug}
                  setState={() => panel.toggle(slug)}
                  state={panel.values.includes(slug)}
                  className="flex-no-wrap"
                >
                  <span className="text-sm">&nbsp;&nbsp;{name}</span>
                </CheckBox>
              )
            })}
          </div>
        </div>
      </>
    )
  },

  Colors: ({ panel }) => {
    const colors = useSelector(
      (state) =>
        Object.values(state.layout.data.filters?.colors || []) as StrapiColor[],
    )

    return (
      <>
        <div className="flex-row flex-wrap">
          {colors.map((v) => (
            <div className="m-1" key={v.slug}>
              <button
                onClick={() => {
                  panel.toggle(v.slug)
                }}
              >
                <div
                  className="rounded-full w-8 h-8 items-center justify-center"
                  style={{
                    backgroundColor: v.value || v.slug.replace('-', ''),
                  }}
                >
                  {panel.values.includes(v.slug) && (
                    <Icon
                      name="check"
                      className="w-5 h-5"
                      style={{
                        color: pickFgColorFromBgColor(
                          v.value || v.slug.replace('-', ''),
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

  Occasions: ({ filter, panel }) => {
    const occasions = useSelector(
      (state) =>
        Object.values(
          state.layout.data.filters?.occasions || [],
        ) as StrapiOccasion[],
    )

    return (
      <>
        <FilterCheckBoxes panel={panel} data={occasions} />
      </>
    )
  },

  Favorites: () => (
    <>
      <span>Coming Soon...</span>
    </>
  ),

  Weather: ({ filter, panel }) => {
    const weather = useSelector(
      (state) =>
        Object.values(
          state.layout.data.filters?.weather || [],
        ) as StrapiOccasion[],
    )

    return (
      <>
        <FilterCheckBoxes panel={panel} data={weather} />
      </>
    )
  },

  Style: ({ filter, panel }) => {
    const styles = useSelector(
      (state) =>
        Object.values(
          state.layout.data.filters?.styles || [],
        ) as StrapiOccasion[],
    )

    return (
      <>
        <FilterCheckBoxes panel={panel} data={styles} />
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

const FilterCheckBoxes = ({ panel, data = undefined }) => {
  return data.map((v: { slug: string; name: string }) => (
    <div key={v.slug} className="py-0.5">
      <CheckBox
        setState={() => panel.toggle(v.slug)}
        state={panel.values.includes(v.slug)}
      >
        <span>&nbsp;&nbsp;{v.name}</span>
      </CheckBox>
    </div>
  ))
}
