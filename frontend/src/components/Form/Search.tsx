import React from 'react'
import debounce from 'lodash/debounce'

import { Icon, iconSearch} from '@/Components/Icons'

import { Input } from './Input'

const toTitleCase = (value: string) =>
  value
    .split(' ')
    .map((v) => v.slice(0, 1).toUpperCase() + v.slice(1).toLowerCase())
    .join(' ')

export const Search = ({field, values}) => {
  const [matches, setMatches] = React.useState<Set<number>>(new Set())
  const debounceMatches = React.useCallback(
    debounce(
        (search: string, values: {slug: string, name: string}[]) => {
        setMatches(new Set(fuzzySearch(
          search,
          values.map(value => value.slug)
        )))
      },
      300
    ),
    []
  )

  React.useEffect(() => {
    debounceMatches(field.value, values)
  }, [field.value])

  const useMatches = matches.size > 0 || field.value
  const matchedIndexes = useMatches
    ? Array.from(matches)
    : values.map((_: unknown, i: number) => i)
    const sortedMatchedIndexes = matchedIndexes.sort((i1, i2) => {
      const d1 = values[i1].slug
      const d2 = values[i2].slug
      return d1 === d2 ? 0 : d1 > d2 ? 1 : -1
    })

    return <>
      <Input field={field}
        after={<Icon icon={iconSearch} size={20} className="mr-2"
          onChange={(value) => {
            debounceMatches(value, values)
          }}
        />}
      />
      <div className="h-full space-y justify-start overflow-y-scroll">
        {sortedMatchedIndexes.map((index: number) => {
          let { slug, name } = values[index]
          return (
            <button
              className="text-left text-base p-1"
              onClick={() => field.setValue(toTitleCase(name))}
            >
              {toTitleCase(name)}
            </button>
          )
        })}
      </div>
    </>
}

/*
* Iterate through each keyword, removing keyword if exists.
* if replacement was made, continue, otherwise, short-circuit
* compare to `emptyRegExp' because this will not affect `newName.length'
*/
export function fuzzySearch(search: string='', values: string[]): number[] {
  const emptyRegExp = String(new RegExp('', 'i'))
  const keywords: RegExp[] = search
  .normalize('NFKD')
  .replace(/[^a-zA-Z0-9_\s]/g, '')
  .split(/\s+/g)
  .filter(v => v)
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

export default Search
