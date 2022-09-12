import React from 'react'
import nock from 'nock'
import DatePicker from '@/Form/DatePicker'
import * as t from '@/utils/test'
import { mockProduct } from '@/Product/__mocks__/product'

const mockState = {
  rentType: 'OneTime',
  oneTime: 'short',
  membership: 'Short',
  dateVisible: false,
}

describe.skip('<DatePicker />', () => {
  it('renders', () => {
    // t.render(<DatePicker />, {
    //   initialState: { shop: mockState, layout: { data: mockProduct } },
    // })
  })
})
