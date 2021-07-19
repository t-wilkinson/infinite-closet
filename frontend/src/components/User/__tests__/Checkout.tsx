import React from 'react'
import nock from 'nock'
import Checkout from '../Checkout'
import * as t from '@/utils/test'

const mockUser = {
  id: '18',
  username: 'string',
  email: 'string',
  provider: 'string',
  password: 'string',
  resetPasswordToken: 'string',
  confirmationToken: 'string',
  confirmed: true,
  blocked: false,
  customer: 'string',
  firstName: 'string',
  lastName: 'string',
  phoneNumber: 'string',
  addresses: [],
  orders: [],
  chestSize: 'string',
  hipsSize: 'string',
  waistSize: 'string',
  dressSize: 'string',
  height: 'string',
  weight: 'string',
  dateOfBirth: 'string',
  created_by: 'string',
  updated_at: 'string',
  published_at: 'string',
}

describe('Tests', () => {
  let component: t.RenderResult

  beforeEach(() => {
    // component = render(<Checkout user={mockUser} />)
  })

  it('works', async () => {
    nock(t.api)
      .post(t.Url('/account/wallet'))
      .reply(200, {})
      .persist()
      .get(t.Url('/orders/cart/:number'))
      .reply(200, { cart: [] })
      .persist()
      .post(t.Url('/orders/cart/price'), /.*/)
      .reply(200, {})
      .persist()
      .get(t.Url('/account/payment-methods'))
      .reply(200, { paymentMethods: [] })
      .persist()
    component = t.render(<Checkout user={mockUser} data={{}} />)
    await t.waitFor(() => {
      expect(t.screen.getByText('Subtotal')).toBeInTheDocument()
    })
  })
})
