import React from 'react'
import nock from 'nock'
import ProductRentContents from '../ProductRentContents'
import * as t from '@/utils/test'
import { mockProduct } from '@/Products/__mocks__/product'

const mockState = {
  rentType: 'OneTime',
  oneTime: 'short',
  membership: 'Short',
  dateVisible: false,
}

const sizeChart = {
  id: '20',
  name: 'FR',
  XXS: '20',
  XS: '20',
  S: '20',
  M: '20',
  L: '20',
  XL: '20',
  _2XL: '20',
  _3XL: '20',
  _4XL: '20',
  _5XL: '20',
  _6XL: '20',
  created_by: null,
  updated_at: null,
  published_at: null,
}

describe('Shop product', () => {
  // it('renders correctly', () => {
  //   expect(component.asFragment()).toMatchSnapshot()
  // })

  it('can be added to cart', () => {})

  it('can add size', () => {
    t.render(
      <ProductRentContents product={mockProduct} sizeChart={sizeChart} />,
      { initialState: { shop: mockState } }
    )

    const Size = t.screen.getByText('Size').nextElementSibling as HTMLElement
    const SizeDropDown = t.within(Size).getByLabelText('Dropdown product sizes')
    t.fireEvent.click(SizeDropDown, {})
    const sizeMD = t.within(Size).getByText(/md/i)
    t.fireEvent.click(sizeMD)
    // expect(t.screen.store.dispatch).toHaveBeenCalled()
    // expect(t.screen.asFragment()).toMatchSnapshot()
  })

  // it('is clicked', () => {
  //   renderer.act(() => {
  //     t.screen.root.findByType('button').props.onClick()
  //   })
  //   expect(store.dispatch).toHaveBeenCalled()
  // })
})
