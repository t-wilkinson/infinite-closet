import React from 'react'
import ProductRentContents from '../ProductRentContents'
import { render, fireEvent, RenderResult, within } from '@/utils/test'

const mockProduct = {
  id: 'string',
  name: 'string',
  slug: 'string',
  designer: { name: 'Designer' },
  shortRentalPrice: 10.0,
  longRentalPrice: 10.0,
  retailPrice: 10.0,
  purchasePrice: 10.0,
  images: [],
  sizes: [{ id: '1', quantity: 1, size: 'MD' }],
  details: 'string',
  stylistNotes: 'string',
  sizingNotes: 'string',
  categories: [],
  colors: [],
  fits: [],
  occasions: [],
  styles: [],
  weather: [],
  categories_: 'string',
  colors_: 'string',
  fits_: 'string',
  occasions_: 'string',
  styles_: 'string',
  weather_: 'string',
  created_by: 'string',
  updated_at: 'string',
  published_at: 'string',
}

const mockState = {
  rentType: 'OneTime',
  oneTime: 'Short',
  membership: 'Short',
  dateVisible: false,
}

describe('Shop product', () => {
  let component: RenderResult

  beforeEach(() => {
    component = render(
      <ProductRentContents product={mockProduct} state={mockState} />,
    )
  })

  it('renders correctly', () => {
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('can add size', () => {
    const Size = component.getByText('Size').nextElementSibling as HTMLElement
    const SizeDropDown = within(Size).getByLabelText('Dropdown product sizes')
    fireEvent.click(SizeDropDown, {})
    const sizeMD = within(Size).getByText(/md/i)
    fireEvent.click(sizeMD)
    expect(component.store.dispatch).toHaveBeenCalled()
    // expect(component.asFragment()).toMatchSnapshot()
  })

  // it('is clicked', () => {
  //   renderer.act(() => {
  //     component.root.findByType('button').props.onClick()
  //   })
  //   expect(store.dispatch).toHaveBeenCalled()
  // })
})
