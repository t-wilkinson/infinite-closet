import React from 'react'
import nock from 'nock'
import DatePicker from '@/Form/DatePicker'
import { mockProduct } from '@/Product/__mocks__/product'
import * as t from '@/utils/test'

const mockState = {
  rentType: 'OneTime',
  oneTime: 'short',
  membership: 'Short',
  dateVisible: false,
}

describe('<DatePicker />', () => {
  it('renders', () => {
    // t.render(<DatePicker />, {
    //   initialState: { shop: mockState, layout: { data: mockProduct } },
    // })
  })
})
