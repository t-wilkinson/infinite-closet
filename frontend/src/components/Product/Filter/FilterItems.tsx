import React from 'react'
import debounce from 'lodash/debounce'

import * as sizing from '@/utils/sizing'
import { useFields, Input, Checkbox } from '@/Form'
import { SizeChartPopup } from '@/Product/SizeChart'
import { Icon, iconSearch} from '@/Components/Icons'

import Color from './Color'
import { Filter } from './types'

type FilterItems = {
  [key in Filter]: (props: {
    filter: Filter
    panel: { values: string[]; toggle: (payload: string) => void; data: any }
  }) => any
}

const toTitleCase = (value: string) =>
  value
    .split(' ')
    .map((v) => v.slice(0, 1).toUpperCase() + v.slice(1).toLowerCase())
    .join(' ')

export const FilterItems: FilterItems = {
  wardrobes: ({ panel }) => {
    return <>
      <FilterCheckboxes panel={panel} />
    </>
  },

  designers: ({ panel }) => {
    const [matches, setMatches] = React.useState<number[]>([])
    const debounceMatches = React.useCallback(
      debounce(
        (search: string, designers: { slug: string; name: string }[]) => {
          fuzzySearch(
            search,
            panel.data.map((designer) => designer.slug)
          ).then((matches) => setMatches(matches))
        },
        300
      ),
      []
    )

    const fields = useFields<{ search: string }>({
      search: {
        label: 'Designer Names',
        onChange: (value) => debounceMatches(value, panel.data),
      },
    })
    const useMatches = matches.length > 0 || fields.get('search').value
    const matchedIndexes = useMatches
      ? matches
      : panel.data.map((_: unknown, i: number) => i)
    const sortedMatchedIndexes = matchedIndexes.sort((i1, i2) => {
      const d1 = panel.data[i1].slug.toUpperCase()
      const d2 = panel.data[i2].slug.toUpperCase()
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
              let { slug, name } = panel.data[index]
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
    return (
      <>
        <div className="flex-row flex-wrap">
          {panel.data.map((color) => (
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
    return (
      <>
        <FilterCheckboxes panel={panel} />
      </>
    )
  },

  favorites: () => (
    <>
      <span>Coming Soon...</span>
    </>
  ),

  sizes: ({ panel }) => {
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
        <FilterCheckboxes
          panel={panel}
          data={Object.values(panel.data)
            .sort(sizing.sort)
            .map((size) => ({ name: size, slug: size }))}
          sort={false}
        />
      </>
    )
  },

  weather: ({ panel }) => {
    return (
      <>
        <FilterCheckboxes panel={panel} />
      </>
    )
  },

  styles: ({ panel }) => {
    return (
      <>
        <FilterCheckboxes panel={panel} />
      </>
    )
  },

  materials: ({ panel }) => {
    return (
      <>
        <FilterCheckboxes panel={panel} />
      </>
    )
  },

  metals: ({ panel }) => {
    return (
      <>
        <FilterCheckboxes panel={panel} />
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

const FilterCheckboxes = ({ panel, data = null, sort = true }) => {
  data =  data || Object.values(panel.data)
  data = sort
    ? data?.sort((v1: { slug: string }, v2: { slug: string }) =>
        v1.slug === v2.slug ? 0 : v1.slug > v2.slug ? 1 : -1
      )
    : data

  if (!Array.isArray(data)) {
    return null
  }

  return (
    <>
      {data?.map((v: { slug: string; name: string }) => (
        <div key={v.slug} className="py-0.5">
          <Checkbox
            size={14}
            onChange={() => panel.toggle(v.slug)}
            value={panel.values.includes(v.slug)}
            labelClassName="whitespace-no-wrap"
            label={v.name}
          />
        </div>
      ))}
    </>
  )
}

export default FilterItems
