/**
 * @group lib
 * @group product
 * @group product/filter
 */
'use strict'
const api = {}
api.filter = require('../services/product')

it('creates raw sql', () => {
  const where = {
    categories: ['clothing', 'sustainable'],
    designers: 'christina-barho',
    colors: ['black', 'purple'],
    occasions: 'brunch',
    weather: ['year-round', 'warm-weather'],
    sizes: ['ONESIZE', 'XXS', 'S', 'M', 'L'],
  }
  const query =
    '( ?? like ? AND ( ?? like ? OR ?? like ? ) AND ?? like ? AND ( ?? like ? OR ?? like ? ) AND ( ?? like ? AND ?? like ? ) AND ( ?? like ? OR ?? like ? OR ?? like ? OR ?? like ? OR ?? like ? ) )'
  const values = [
    'designers.slug',
    '%christina-barho%',
    'colors_',
    '%black%',
    'colors_',
    '%purple%',
    'occasions_',
    '%brunch%',
    'weather_',
    '%year-round%',
    'weather_',
    '%warm-weather%',
    'categories_',
    '%clothing%',
    'categories_',
    '%sustainable%',
    'sizes_',
    '%ONESIZE%',
    'sizes_',
    '%XXS%',
    'sizes_',
    '%S%',
    'sizes_',
    '%M%',
    'sizes_',
    '%L%',
  ]

  const raw1 = api.filter.toRawSQL(where)
  expect(raw1[0]).toStrictEqual(query)
  expect(raw1[1]).toStrictEqual(values)
})
