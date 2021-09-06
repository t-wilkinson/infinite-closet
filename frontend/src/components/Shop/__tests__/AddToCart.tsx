import React from 'react'
import nock from 'nock'
import dayjs from 'dayjs'

import * as t from '@/utils/test'
import { mockProduct } from '@/Products/__mocks__/product'

import ProductRentContents, {
  OneTimeRentalTime,
  OneTimeSizeSelector,
} from '../ProductRentContents'

const mockState = {
  rentType: 'OneTime',
  oneTime: 'short',
  membership: 'Short',
  dateVisible: false,
} as const

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

describe('Add to cart', () => {
  const render = (initialState: object) => {
    // TODO: this does not work
    return t.render(<ProductRentContents product={mockProduct} />, {
      initialState,
    })
  }

  it('works for guest', () => {
    const scope = nock(t.api).get('/size-chart').reply(200, sizeChart)

    const selectedDate = dayjs()
    selectedDate.set('day', selectedDate.get('day') + 15)
    const component = render({
      shop: { ...mockState, selectedDate, size: 'MD' },
      user: { data: null },
    })

    const addToCart = t.screen.getByText(/Add to Cart/)
    t.fireEvent.click(addToCart)
  })
})

describe('OneTimeSizeSelector', () => {
  const render = (
    initialState: t.PartialState,
    { setChartOpen = () => {}, chartOpen }
  ) => {
    t.render(
      <OneTimeSizeSelector
        product={mockProduct}
        setChartOpen={setChartOpen}
        chartOpen={chartOpen}
      />,
      {
        initialState,
      }
    )
  }

  // prettier-ignore
  it('is populated with users size', () => {
    render({ shop: mockState, user: { data: { size: 'MD'} } }as any, {chartOpen: false})

    const Size = t.screen.getByText('Size').nextElementSibling as HTMLElement
    expect(t.within(Size).getByText(/md/i)).toBeInTheDocument()
  })

  // prettier-ignore
  it('is populated with text', () => {
    render({ shop: mockState }, {chartOpen: false})

    const SizeSelector = t.screen.getByText('Size').nextElementSibling as HTMLElement
    expect(t.within(SizeSelector).getByText(/select size/i)).toBeInTheDocument()
  })

  // prettier-ignore
  it('can select size', () => {
    render({ shop: mockState }, {chartOpen: true})

    const SizeSelector = t.screen.getByText('Size').nextElementSibling as HTMLElement
    const sizeMD = t.within(SizeSelector).getByText(/md/i)

    t.fireEvent.click(sizeMD)
    expect(t.within(SizeSelector).getByText(/md/i)).toBeInTheDocument()
  })
})

// prettier-ignore
describe('OneTimeRentalTime', () => {
  const render = (initialState: t.PartialState) => {
    t.render(<OneTimeRentalTime />, {
      initialState,
    })
  }

  it('renders', () => {
    render({ shop: mockState })
  })

  // TODO
  it('can select rental length', () => {
    render({ shop: mockState })
     t.screen.getByText('Rental time').nextElementSibling as HTMLElement
  })

  // TODO
  it('can select date', () => {
    render({ shop: mockState })
     t.screen.getByText('Rental time').nextElementSibling as HTMLElement
  })
})
