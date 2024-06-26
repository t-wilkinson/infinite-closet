/**
 * @group lib
 */
'use strict'
const sizing = require('../services/size')

describe('Size range', () => {
  it('Should be empty when size has no value', () => {
    expect(sizing.sizes({sizeRange: 'M'})).toEqual([])
  })

  test.each([
    ['M', 'L', 'M'],
    ['M', undefined, 'M'],
  ])('%s-%s contains %s', (start, end, expected) => {
    expect(
      sizing.sizes({ size: start, sizeRange: end }).includes(expected)
    ).toBeTruthy()
  })

  test.each([
    ['M', 'L', 'S'],
    ['S', undefined, 'L'],
  ])('%s-%s does not contain %s', (start, end, expected) => {
    expect(
      sizing.sizes({ size: start, sizeRange: end }).includes(expected)
    ).toBeFalsy()
  })
})
