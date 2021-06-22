const sizeOrders = [
  'XXS',
  'XS',
  'SM',
  'S',
  'MD',
  'M',
  'LG',
  'L',
  'XL',
  'XXL',
]

const nums = new RegExp(/\d+/)
export const sortSizes = (size1, size2) => {
  const s1 = size1.size || size1.slug || size1
  const s2 = size2.size || size2.slug || size2
  const n1 = s1.match(nums)
  const n2 = s2.match(nums)

  if (n1 && n2) {
    return parseInt(n1[0]) - parseInt(n2[0])
  } else if (n1 && !n2) {
    return -1
  } else if (!n1 && n2) {
    return 1
  } else if (!n1 && !n2) {
    return sizeOrders.indexOf(s1) - sizeOrders.indexOf(s2)
  }
}
