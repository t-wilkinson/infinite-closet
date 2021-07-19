import { StrapiSize } from '@/utils/models'

import { _Size, Size } from '@/Products/constants'

export const normalize = (size: string) => size?.replace('_', '')
export const unnormalize = (size: string) => size.replace(/^(\d)/, '_$1')
export const index = (sizes: StrapiSize[], size: string) =>
  sizes.map((s) => s.size).indexOf(size as _Size)
export const get = (sizes: StrapiSize[], size: string) =>
  sizes.find((s) => rangeOf(s).includes(size))

export const sort = (s1: Size, s2: Size) => {
  return Size.indexOf(s1) - Size.indexOf(s2)
}

export const rangeOf = ({ size, sizeRange }: StrapiSize) => {
  let acc = []
  const s1 = normalize(size) as Size
  const s2 = normalize(sizeRange) as Size
  if (s2) {
    for (const s of Size.slice(Size.indexOf(s1), Size.indexOf(s2) + 1)) {
      acc.push(s)
    }
  } else {
    acc.push(s1)
  }
  return acc
}

export const range = (sizes: StrapiSize[]) =>
  Array.from(
    new Set(sizes.reduce((acc, size) => acc.concat(rangeOf(size)), [])),
  ).sort(sort)
