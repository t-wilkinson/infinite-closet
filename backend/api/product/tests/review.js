/**
 * @group lib
 * @group product/review
 */
'use strict'
const api = {}
api.reviews = require('../services/review')

const mock = (data) => ({
  user: 1,
  product: 1,
  rating: 5,
  fit: 'true',
  heading: 'Heading',
  message: 'message',
  images: [],
  ...data,
})
const mockMany = (...dataArray) => dataArray.map((data) => mock(data))

describe('Ability to review', () => {
  function canReview(orders) {
    return api.reviews.canReview(orders)
  }
  it('can review product that they have ordered and not reviewed yet', () => {
    expect(canReview([{}])).toBe(true)
  })

  it('can\'t review product that they haven\'t ordered', () => {
    expect(canReview([])).toBe(false)
  })

  it('can\'t review product that they have already reviewed', () => {
    expect(canReview([{review: 1}])).toBe(false)
  })
})

it('calculates correct ratings', () => {
  const reviews = mockMany(
    { rating: 3 },
    { rating: 5 },
    { rating: 2 },
    { rating: 1 },
    { rating: 4 },
  )
  expect(api.reviews.rating(reviews)).toBe(3)
})

it('calculates fit', () => {
  let reviews
  reviews = mockMany(
    { fit: 'true' },
    { fit: 'small' },
    { fit: 'true' },
    { fit: 'large' },
    { fit: 'large' },
  )

  expect(api.reviews.fit(reviews)).toBe('true')

  reviews = mockMany({ fit: 'true' }, { fit: 'small' }, { fit: 'large' })
  expect(api.reviews.fit(reviews)).toBe('true')

  reviews = mockMany({ fit: 'true' }, { fit: 'large' }, { fit: 'large' })
  expect(api.reviews.fit(reviews)).toBe('large')
})

it.todo('reviews')
