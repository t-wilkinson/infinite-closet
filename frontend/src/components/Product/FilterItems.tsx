import React from 'react'
import debounce from 'lodash/debounce'

import { useSelector } from '@/utils/store'
import * as sizing from '@/utils/sizing'
import { useFields, Input, Checkbox } from '@/Form'
import { SizeChartPopup } from '@/Product/SizeChart'
import { Icon, iconSearch } from '@/Components/Icons'

import Color from './Color'
import { Filter } from './types'

type FilterItems = {
  [key in Filter]: (props: {
    filter: Filter
    panel: { values: string[]; toggle: (payload: string) => void }
  }) => any
}

const toTitleCase = (value: string) =>
  value
    .split(' ')
    .map((v) => v.slice(0, 1).toUpperCase() + v.slice(1).toLowerCase())
    .join(' ')

export const FilterItems: FilterItems = {
  designers: ({ panel }) => {
    const designers = useSelector((state) =>
      Object.values(state.layout.data.designers)
    )
    const [matches, setMatches] = React.useState<number[]>([])
    const debounceMatches = React.useCallback(
      debounce(
        (search: string, designers: { slug: string; name: string }[]) => {
          fuzzySearch(
            search,
            designers.map((designer) => designer.slug)
          ).then((matches) => setMatches(matches))
        },
        300
      ),
      []
    )

    const fields = useFields<{ search: string }>({
      search: {
        label: 'Designer Names',
        onChange: (value) => debounceMatches(value, designers),
      },
    })
    const useMatches = matches.length > 0 || fields.get('search').value
    const matchedIndexes = useMatches
      ? matches
      : designers.map((_: unknown, i: number) => i)
    const sortedMatchedIndexes = matchedIndexes.sort((i1, i2) => {
      const d1 = designers[i1].slug.toUpperCase()
      const d2 = designers[i2].slug.toUpperCase()
      return d1 === d2 ? 0 : d1 > d2 ? 1 : -1
    })

    return (
      <>
        <div className="h-64 justify-start">
          <Input
            field={fields.get('search')}
            after={<Icon icon={iconSearch} size={20} className="mr-2" />}
          />
          <div className="h-3" />
          <div className="h-full space-y justify-start overflow-y-scroll">
            {sortedMatchedIndexes.map((index: number) => {
              let { slug, name } = designers[index]
              return (
                <Checkbox
                  size={14}
                  key={slug}
                  onChange={() => {
                    panel.toggle(slug)
                  }}
                  value={panel.values.includes(slug)}
                  className="flex-no-wrap"
                  labelClassName="whitespace-no-wrap"
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
      Object.values(state.layout.data.colors)
    )

    return (
      <>
        <div className="flex-row flex-wrap">
          {colors.map((color) => (
            <Color key={color.slug} panel={panel} color={color} />
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
      Object.values(state.layout.data.occasions)
    )

    return (
      <>
        <FilterCheckboxes panel={panel} data={occasions} />
      </>
    )
  },

  favorites: () => (
    <>
      <span>Coming Soon...</span>
    </>
  ),

  sizes: ({ panel }) => {
    const sizes = useSelector((state) =>
      Object.values(state.layout.data.sizes)
        .sort(sizing.sort)
        .map((size) => ({ name: size, slug: size }))
    )
    const [state, setState] = React.useState(false)

    return (
      <>
        <div className="flex-row">
          <a
            onClick={() => setState(!state)}
            className="underline cursor-pointer mb-4"
          >
            Size chart
          </a>
          <div className="z-30 absolute ml-16">
            <SizeChartPopup state={state} setState={setState} />
          </div>
        </div>
        <FilterCheckboxes panel={panel} data={sizes} sort={false} />
      </>
    )
  },

  weather: ({ panel }) => {
    const weather = useSelector((state) =>
      Object.values(state.layout.data.weather)
    )

    return (
      <>
        <FilterCheckboxes panel={panel} data={weather} />
      </>
    )
  },

  styles: ({ panel }) => {
    const styles = useSelector((state) =>
      Object.values(state.layout.data.styles)
    )

    return (
      <>
        <FilterCheckboxes panel={panel} data={styles} />
      </>
    )
  },

  materials: ({ panel }) => {
    const data = useSelector((state) =>
      Object.values(state.layout.data.materials)
    )

    return (
      <>
        <FilterCheckboxes panel={panel} data={data} />
      </>
    )
  },

  metals: ({ panel }) => {
    const data = useSelector((state) => Object.values(state.layout.data.metals))

    return (
      <>
        <FilterCheckboxes panel={panel} data={data} />
      </>
    )
  },
}

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

const FilterCheckboxes = ({ panel, data, sort = true }) => {
  data = sort
    ? data?.sort((v1: { slug: string }, v2: { slug: string }) =>
        v1.slug === v2.slug ? 0 : v1.slug > v2.slug ? 1 : -1
      )
    : data

  return data?.map((v: { slug: string; name: string }) => (
    <div key={v.slug} className="py-0.5">
      <Checkbox
        size={14}
        onChange={() => panel.toggle(v.slug)}
        value={panel.values.includes(v.slug)}
        labelClassName="whitespace-no-wrap"
        label={v.name}
      />
    </div>
  ))
}

export default FilterItems