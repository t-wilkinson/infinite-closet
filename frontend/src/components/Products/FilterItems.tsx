import React from 'react'
import debounce from 'lodash/debounce'

import { Icon } from '@/components'
import { useSelector } from '@/utils/store'
import useFields from '@/Form/useFields'
import { Input, Checkbox } from '@/Form'

import { Filter } from './types'

type FilterItems = {
  [key in Filter]: (props: {
    filter: Filter
    panel: { values: string[]; toggle: (payload: string) => void }
  }) => any
}

const toTitleCase = (value) =>
  value
    .split(' ')
    .map((v) => v.slice(0, 1).toUpperCase() + v.slice(1).toLowerCase())
    .join(' ')

export const FilterItems: FilterItems = {
  designers: ({ panel }) => {
    const designers = useSelector((state) =>
      Object.values(state.layout.data.designers),
    )
    const [matches, setMatches] = React.useState<number[]>([])
    const debounceMatches = React.useCallback(
      debounce(
        (search: string, designers: { slug: string; name: string }[]) => {
          fuzzySearch(
            search,
            designers.map((designer) => designer.slug),
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
              let { slug, name } = designers[index]
              return (
                <Checkbox
                  key={slug}
                  onChange={() => panel.toggle(slug)}
                  value={panel.values.includes(slug)}
                  className="flex-no-wrap"
                  label={toTitleCase(name)}
                />
              )
            })}
          </div>
        </div>
      </>
    )
  },

  colors: ({ panel }) => {
    const colors = useSelector((state) =>
      Object.values(state.layout.data.colors),
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
                  className="rounded-full w-8 h-8 items-center justify-center border-gray"
                  style={{
                    background:
                      v.slug === 'multicolor'
                        ? `linear-gradient(
                          45deg,
                          rgba(255,0,0,1) 0%,
                          rgba(255,154,0,1) 10%,
                          rgba(208,222,33,1) 20%,
                          rgba(79,220,74,1) 30%,
                          rgba(63,218,216,1) 40%,
                          rgba(47,201,226,1) 50%,
                          rgba(28,127,238,1) 60%,
                          rgba(95,21,242,1) 70%,
                          rgba(186,12,248,1) 80%,
                          rgba(251,7,217,1) 90%,
                          rgba(255,0,0,1) 100%
                        )`
                        : v.value || v.slug.replace('-', ''),
                    borderWidth:
                      v.slug === 'white' || v.value === '#ffffff' ? 1 : 0,
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

  datesAvailable: () => (
    <>
      <span>Coming Soon...</span>
    </>
  ),

  occasions: ({ panel }) => {
    const occasions = useSelector((state) =>
      Object.values(state.layout.data.occasions),
    )

    return (
      <>
        <FilterCheckBoxes panel={panel} data={occasions} />
      </>
    )
  },

  favorites: () => (
    <>
      <span>Coming Soon...</span>
    </>
  ),

  weather: ({ panel }) => {
    const weather = useSelector((state) =>
      Object.values(state.layout.data.weather),
    )

    return (
      <>
        <FilterCheckBoxes panel={panel} data={weather} />
      </>
    )
  },

  styles: ({ panel }) => {
    const styles = useSelector((state) =>
      Object.values(state.layout.data.styles),
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
    .normalize('NFKD')
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
      <Checkbox
        onChange={() => panel.toggle(v.slug)}
        value={panel.values.includes(v.slug)}
        label={v.name}
      />
    </div>
  ))
}
