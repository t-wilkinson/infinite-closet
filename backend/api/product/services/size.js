'use strict'

const sizeEnum = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '_2XL']

// {size: S, sizeRange: _2XL} -> S,M,L,XL,_2XL
function sizes({ size: start, sizeRange: end }) {
  const e = sizeEnum
  let sizes
  if (!start) {
    sizes = []
  } else if (!end) {
    sizes = [e[e.indexOf(start)]]
  } else {
    sizes = e.slice(e.indexOf(start), e.indexOf(end) + 1)
  }
  return sizes.filter(s=>s).map(normalize)
}

function normalize(size) {
  return size.replace('_', '')
}

/**
 * Return quantity of size
 */
function quantity(sizes, size) {
  const foundSize = sizes.find((s) => s.size === size)
  if (foundSize) {
    return foundSize.quantity
  } else {
    return 0
  }
}

module.exports = {
  enum: sizeEnum,
  sizes,
  normalize,
  quantity,

  // TODO: should probably use underlying sizes function
  // {size: S, sizeRange: _2XL} -> S-2XL
  range({size: start, sizeRange: end}) {
    const s = sizes({size: start, sizeRange: end})
    if (s.length === 0) {
      return undefined
    } else if (s.length === 1) {
      return s.at(0)
    } else {
      return `${s.at(0)}-${s.at(-1)}`
    }
  }
}
