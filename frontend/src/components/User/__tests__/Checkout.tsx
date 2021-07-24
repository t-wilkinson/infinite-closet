import React from 'react'
import nock from 'nock'
import Checkout from '../Checkout'
import * as t from '@/utils/test'
import mockUser from '../__mocks__/user'

describe('Tests', () => {
  let component: t.RenderResult

  beforeEach(() => {
    // component = render(<Checkout user={mockUser} />)
  })

  it('works', async () => {
    nock(t.api)
      .persist()
      .post(t.Url('/account/wallet'))
      .reply(200, {})
      .get(t.Url('/orders/cart/:number'))
      .reply(200, { cart: [] })
      .post(t.Url('/orders/cart/price'), /.*/)
      .reply(200, {})
      .get(t.Url('/account/payment-methods'))
      .reply(200, { paymentMethods: [] })
      .post(t.Url('/account/signin'), {})
      .reply(200)
    component = t.render(<Checkout user={mockUser} data={{}} />)
    await t.waitFor(() => {
      expect(t.screen.getByText('Subtotal')).toBeInTheDocument()
    })
  })
})
