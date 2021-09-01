const sizing = require('../../api/sizing/services/size')

describe.skip('Sizing', () => {
  test.each([
    ['MD', 'LG', 'MD'],
    ['MD', undefined, 'MD'],
  ])('Contains', (start, end, expected) => {
    expect(
      sizing.contains({ size: start, sizeRange: end }, expected)
    ).toBeTruthy()
  })

  test.each([
    ['MD', 'LG', 'SM'],
    ['SM', undefined, 'LG'],
  ])('Does not contain', (start, end, expected) => {
    expect(
      sizing.contains({ size: start, sizeRange: end }, expected)
    ).toBeFalsy()
  })
})
