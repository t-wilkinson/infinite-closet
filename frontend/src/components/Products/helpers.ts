import { StrapiSize } from '@/utils/models'

import { _Size, Size } from './constants'

export const normalizeSize = (size: string) => size?.replace('_', '')
export const normalizeSizes = (sizes: string[]) => sizes.map(normalizeSize)
export const unNormalizeSize = (size: string) => size.replace(/^(\d)/, '_$1')
export const sizeIndex = (sizes: StrapiSize[], size: string) =>
  sizes.map((s) => s.size).indexOf(size as _Size)

export const sortSizes = (s1: Size, s2: Size) => {
  return Size.indexOf(s1) - Size.indexOf(s2)
}

export const sizeRange = (sizes: StrapiSize[]) =>
  sizes.reduce((acc, { size, sizeRange }) => {
    const s1 = normalizeSize(size) as Size
    const s2 = normalizeSize(sizeRange) as Size
    if (s2) {
      return acc.concat(Size.slice(Size.indexOf(s1), Size.indexOf(s2) + 1))
    } else {
      acc.push(s1)
      return acc
    }
  }, [])
