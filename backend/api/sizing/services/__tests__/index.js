/**
 * @group lib
 */
const sizing = require('../size')

describe.skip('Size range', () => {
  test.skip.each([
    ['M', 'L', 'M'],
    ['M', undefined, 'M'],
  ])('%s-%s contains %s', (start, end, expected) => {
    expect(
      sizing.contains({ size: start, sizeRange: end }, expected)
    ).toBeTruthy()
  })

  test.skip.each([
    ['M', 'L', 'S'],
    ['S', undefined, 'L'],
  ])('%s-%s does not contain %s', (start, end, expected) => {
    expect(
      sizing.contains({ size: start, sizeRange: end }, expected)
    ).toBeFalsy()
  })
})
