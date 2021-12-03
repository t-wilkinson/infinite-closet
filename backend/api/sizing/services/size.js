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

module.exports = {
  enum: sizeEnum,
  sizes,
  normalize,

  contains(order, size) {
    return sizes(order).includes(size)
  },

  // TODO: should probably use underlying sizes function
  // {size: S, sizeRange: _2XL} -> S-2XL
  range({size: start, sizeRange: end}) {
    if (!start) {
      return undefined
    } else if (!end || start === end) {
      return normalize(start)
    } else {
      return `${normalize(start)}-${normalize(end)}`
    }
  }
}
