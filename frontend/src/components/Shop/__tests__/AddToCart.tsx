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

const renderShopContents = (initialState: object) => {
  t.render(
    <ProductRentContents product={mockProduct} sizeChart={sizeChart} />,
    { initialState }
  )
}

// prettier-ignore
describe('<Shop /> size selector', () => {
  it('is populated with users size', () => {
    renderShopContents({ shop: mockState, user: { data: { size: 'MD' } } })

    const Size = t.screen.getByText('Size').nextElementSibling as HTMLElement
    expect(t.within(Size).getByText(/md/i)).toBeInTheDocument()
  })

  it('is populated with text', () => {
    renderShopContents({ shop: mockState })

    const SizeSelector = t.screen.getByText('Size').nextElementSibling as HTMLElement
    expect(t.within(SizeSelector).getByText(/select size/i)).toBeInTheDocument()
  })

  it('can select size', () => {
    renderShopContents({ shop: mockState })

    const SizeSelector = t.screen.getByText('Size').nextElementSibling as HTMLElement
    const SizeDropDown = t.within(SizeSelector).getByLabelText('Dropdown product sizes')

    t.fireEvent.click(SizeDropDown, {})
    const sizeMD = t.within(SizeSelector).getByText(/md/i)

    t.fireEvent.click(sizeMD)
    expect(t.within(SizeSelector).getByText(/md/i)).toBeInTheDocument()
  })
})

// prettier-ignore
describe('<Shop /> rental time', () => {
  it('renders', () => {
    renderShopContents({ shop: mockState })
  })

  // TODO
  it('can select rental length', () => {
    renderShopContents({ shop: mockState })
     t.screen.getByText('Rental time').nextElementSibling as HTMLElement
  })

  // TODO
  it('can select date', () => {
    renderShopContents({ shop: mockState })
     t.screen.getByText('Rental time').nextElementSibling as HTMLElement
  })
})
