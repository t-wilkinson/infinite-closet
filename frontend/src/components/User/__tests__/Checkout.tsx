import React from 'react'
import nock from 'nock'
import Checkout from '../Checkout'
import * as t from '@/utils/test'
import mockUser from '../__mocks__/user'
import { mockCart } from '@/User/__mocks__/order'

describe('Tests', () => {
  beforeEach(() => {
    let store = {
      cart: mockCart,
    }

    jest.spyOn(localStorage, 'getItem')
    localStorage.getItem = jest.fn((key) => store[key])
    jest.spyOn(localStorage, 'setItem')
    localStorage.setItem = jest.fn((key, value) => (store[key] = value))
    jest.spyOn(localStorage, 'clear')
    localStorage.clear = jest.fn(() => (store = {}))
  })

  it('works', async () => {
    nock(t.api)
      .persist()
      .post(t.Url('/account/wallet'))
      .reply(200, {})
      .post(t.Url('/orders/cart/create'), { orders: [] })
      .reply(200, { cart: mockCart })
      .post(t.Url('/orders/cart/price'), /.*/)
      .reply(200, {})
      .get(t.Url('/account/payment-methods'))
      .reply(200, { paymentMethods: [] })
      .post(t.Url('/account/signin'), {})
      .reply(200)

    t.render(<Checkout user={mockUser} />)
    await t.waitFor(() => {
      expect(t.screen.getByText('Subtotal')).toBeInTheDocument()
    })
  })
})
