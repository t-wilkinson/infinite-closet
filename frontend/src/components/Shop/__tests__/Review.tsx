import {getNumStars} from '../Review'

describe('Rating', () => {
  it('works on decimals', () => {
    expect(getNumStars(3.5)).toEqual({
      full: 3,
      half: true,
      empty: 1,
    })
  })

  it('works on integers', () => {
    expect(getNumStars(3)).toEqual({
      full: 3,
      half: false,
      empty: 2,
    })
  })

  it('works on perfect rating', () => {
    expect(getNumStars(5)).toEqual({
      full: 5,
      half: false,
      empty: 0,
    })
  })
})
