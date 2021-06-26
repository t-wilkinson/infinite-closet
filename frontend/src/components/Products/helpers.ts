const sizeOrders = [
  'XXS',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  '2XL',
  '3XL',
  '4XL',
  '5XL',
  '6XL',
]

export const sortSizes = (s1, s2) => {
  return sizeOrders.indexOf(s1) - sizeOrders.indexOf(s2)
}

export const sizeRange = (sizes) =>
  sizes.reduce((acc, { size, sizeRange }) => {
    if (sizeRange) {
      return acc.concat(
        sizeOrders.slice(
          sizeOrders.indexOf(size),
          sizeOrders.indexOf(sizeRange) + 1,
        ),
      )
    } else {
      acc.push(size)
      return acc
    }
  }, [])
