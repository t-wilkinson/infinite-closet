import React from 'react'
import nock from 'nock'
import { CartItem } from '../Cart'
import * as t from '@/utils/test'
import mockOrder, { cartItem } from '../__mocks__/order'

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
    component: t.render(<CartItem {...mockItem} />),
    item: mockItem,
  }
}

describe('<Cart />', () => {
  it('tests', () => {})
  // it('renders', () => {
  //   renderCartItem()
  // })
  // it('can be removed', async () => {
  //   const { item } = renderCartItem()
  //   const scope = nock(t.api)
  //     .delete(t.Url('/ordersr/cart/:id', item))
  //     .reply(200, {})
  //     .get(t.Url('/orders/cart/count'))
  //     .reply(200, { count: 0 })
  //   const removeButton = t.screen.getByLabelText(/remove/i)
  //   t.userEvent.click(removeButton)
  //   await t.waitFor(() => {
  //     expect(removeButton).toBeCalledTimes(1)
  //   })
  //   expect(scope.done())
  // })
  // await t.waitFor(() => {
  //   expect(t.screen.getByText('Subtotal')).toBeInTheDocument()
  // })
})
