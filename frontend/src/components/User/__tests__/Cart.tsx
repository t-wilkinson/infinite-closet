import React from 'react'
import nock from 'nock'
import { CartItem } from '../Cart'
import * as t from '@/utils/test'
import { cartItem } from '../__mocks__/order'
jest.mock('next/image')

const mockCartItem = (props: object): CartItem => {
  return {
    ...cartItem,
    remove: jest.fn(),
    toggleInsurance: jest.fn(),
    ...props,
  }
}

const renderCartItem = (props: object = {}) => {
  const mockItem = mockCartItem(props)
  return {
    ...mockItem,
    component: t.render(<CartItem {...mockItem} />),
  }
}

describe('<Cart />', () => {
  it('renders', () => {
    renderCartItem()
  })

  it('can be removed', async () => {
    const item = renderCartItem()
    const scope = nock(t.api)
      .delete(t.Url('/orders/cart/:id', item))
      .reply(200, {})
      .get(t.Url('/orders/cart/count'))
      .reply(200, { count: 0 })

    const removeButton = t.screen.getByLabelText(/remove/i)
    t.userEvent.click(removeButton)

    await t.waitFor(() => {
      expect(item.remove).toBeCalledTimes(1)
    })
    expect(scope.done())
  })

  // it('can toggle insurance', async () => {
  //   await t.waitFor(() => {
  //     const item = renderCartItem({ value: false })

  //     const toggleInsurance = t.screen.getByLabelText(/insurance/i)
  //     t.userEvent.click(toggleInsurance)

  // TODO: hangs
  //     expect(item.toggleInsurance).toBeCalledTimes(1)
  //     // expect(t.screen.getByRole(/checkbox/i)).toHaveAttribute(
  //     //   'checked'
  //     //   // 'true'
  //     // )
  //   })
  // })
})
