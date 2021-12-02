import {getNumStars} from '../Review'
import {ReviewsContent} from '../Reviews'
import * as t from '@/utils/test'
import mockUser from '@/User/__mocks__/user'

describe('Rating', () => {
  it('works on decimals', () => {
    expect(getNumStars(3.5)).toEqual({
      full: 3,
      useHalf: true,
      empty: 1,
    })
  })

  it('works on integers', () => {
    expect(getNumStars(3)).toEqual({
      full: 3,
      useHalf: false,
      empty: 2,
    })
  })

  it('works on perfect rating', () => {
    expect(getNumStars(5)).toEqual({
      full: 5,
      useHalf: false,
      empty: 0,
    })
  })
})

describe('Reviews', () => {
  let defaultData = {
    fit: 'true',
    rating: 3,
    reviews: [],
    canReview: false,
  }
  const mock = (obj) => ({...defaultData, ...obj})

  it('shows <AddReview /> when user can review (and there are no reviews)', () => {
    t.render(
      <ReviewsContent slug="slug" data={mock({reviews: [], canReview: true})} />
    )
    const addReview = t.screen.getByTestId("add-review")
    expect(addReview).toBeInTheDocument()
  })

  it('shows <AddReview /> when user can review (and there are reviews)', () => {
    t.render(
      <ReviewsContent slug="slug" data={mock({reviews: [{id: 1, order: {user: mockUser}}], canReview: true})} />
    )
    const addReview = t.screen.getByTestId("add-review")
    expect(addReview).toBeInTheDocument()
  })

  it('does not show <AddReview /> when user can\'t review (and there are no reviews)', () => {
    t.render(
      <ReviewsContent slug="slug" data={mock({reviews: [], canReview: false})} />
    )
    const addReview = t.screen.queryByTestId("add-review")
    expect(addReview).not.toBeInTheDocument()
  })

  it('does not show <AddReview /> when user can\'t review (and there are)', () => {
    t.render(
      <ReviewsContent slug="slug" data={mock({reviews: [{id: 1, order: {user: mockUser}}], canReview: false})} />
    )
    const addReview = t.screen.queryByTestId("add-review")
    expect(addReview).not.toBeInTheDocument()
  })

})
