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
