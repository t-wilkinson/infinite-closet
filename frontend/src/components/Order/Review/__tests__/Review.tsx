test.skip('', () => {})
// import { getNumStars } from '../Review'
// import { ReviewsContent } from '../Reviews'
// import * as t from '@/utils/test'
// import mockUser from '@/User/__mocks__/user'

// describe('Rating', () => {
//   it('works on decimals', () => {
//     expect(getNumStars(3.5)).toEqual({
//       full: 3,
//       useHalf: true,
//       empty: 1,
//     })
//   })

//   it('works on integers', () => {
//     expect(getNumStars(3)).toEqual({
//       full: 3,
//       useHalf: false,
//       empty: 2,
//     })
//   })

//   it('works on perfect rating', () => {
//     expect(getNumStars(5)).toEqual({
//       full: 5,
//       useHalf: false,
//       empty: 0,
//     })
//   })
// })

// describe('User can add review', () => {
//   let defaultData = {
//     fit: 'true',
//     rating: 3,
//   }
//   const mock = (obj) => ({ ...defaultData, ...obj })
//   const showsAddReview = ({ canReview, existingReview }) => {
//     t.render(
//       <ReviewsContent
//         slug="slug"
//         data={mock({
//           orders: existingReview
//             ? [{ id: 1, review: { id: 1 }, user: mockUser }]
//             : [],
//           canReview,
//         })}
//       />
//     )
//     const addReview = t.screen.queryByTestId('add-review')
//     return addReview
//   }

//   it('shows AddReview when user can review (and there are no reviews)', () => {
//     const addReview = showsAddReview({canReview: true, existingReview: false})
//     expect(addReview).toBeInTheDocument()
//   })

//   it('shows AddReview when user can review (and there are reviews)', () => {
//     const addReview = showsAddReview({canReview: true, existingReview: true})
//     expect(addReview).toBeInTheDocument()
//   })

//   it("does not show AddReview when user can't review (and there are no reviews)", () => {
//     const addReview = showsAddReview({canReview: false, existingReview: false})
//     expect(addReview).not.toBeInTheDocument()
//   })

//   it("does not show AddReview when user can't review (and there are)", () => {
//     const addReview = showsAddReview({canReview: false, existingReview: true})
//     expect(addReview).not.toBeInTheDocument()
//   })
// })
