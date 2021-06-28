import { Size } from './constants'

export const normalizeSizes = (sizes) => sizes.map(normalizeSize)
export const normalizeSize = (size) => size.replace('_', '')
export const unNormalizeSize = (size) => size.replace(/^(\d)/, '_$1')

export const sortSizes = (s1, s2) => {
  return Size.indexOf(s1) - Size.indexOf(s2)
}

export const sizeRange = (sizes) =>
  sizes.reduce((acc, { size, sizeRange }) => {
    if (sizeRange) {
      return acc.concat(
        Size.slice(Size.indexOf(size), Size.indexOf(sizeRange) + 1),
      )
    } else {
      acc.push(size)
      return acc
    }
  }, [])
