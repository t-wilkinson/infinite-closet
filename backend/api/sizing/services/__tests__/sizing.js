/**
 * @group lib
 */
'use strict'
const sizing = require('../size')

describe('Size range', () => {
  test.each([
    ['M', 'L', 'M'],
    ['M', undefined, 'M'],
  ])('%s-%s contains %s', (start, end, expected) => {
    expect(
      sizing.contains({ size: start, sizeRange: end }, expected)
    ).toBeTruthy()
  })

  test.each([
    ['M', 'L', 'S'],
    ['S', undefined, 'L'],
  ])('%s-%s does not contain %s', (start, end, expected) => {
    expect(
      sizing.contains({ size: start, sizeRange: end }, expected)
    ).toBeFalsy()
  })
})
