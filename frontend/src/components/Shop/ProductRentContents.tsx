import React from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import useAnalytics from '@/utils/useAnalytics'
import { useDispatch, useSelector } from '@/utils/store'
import { Icon } from '@/components'
import { Submit } from '@/Form'
import { toTitleCase } from '@/utils/helpers'
import { unNormalizeSize } from '@/Products/helpers'

import { shopActions } from './slice'
import { OneTime } from './types'
import DatePicker from './DatePicker'

export const ProductRentContents = ({ data, product, state }) => {
  const router = useRouter()
  const Contents = productRentContents[state.rentType]
  const user = useSelector((state) => state.user.data)
  const dispatch = useDispatch()

  return (
    <div className="">
      <Contents
        data={data}
        router={router}
        user={user}
        product={product}
        state={state}
        dispatch={dispatch}
      />
    </div>
  )
}
export default ProductRentContents

const rentalLengths: { [key in OneTime]: number } = {
  Short: 4,
  Long: 8,
}

interface Size {
  id: number
  size: string
  quantity: number
}

export const productRentContents = {
  OneTime: ({ data, user, dispatch, product, state, router }) => {
    const [status, setStatus] = React.useState<null | string>(null)
    const [chartOpen, setChartOpen] = React.useState(false)
    const analytics = useAnalytics()

    const addToCart = () => {
      setStatus('adding')
      axios
        .post(
          '/orders',
          {
            status: 'cart',
            size: unNormalizeSize(product.sizes[state.size].size),
            date: state.selectedDate.toJSON(),
            rentalLength: state.oneTime,
            product: product.id,
          },
          { withCredentials: true },
        )
        .then(() => {
          router.push('/user/checkout')
          analytics?.logEvent('add_to_cart', {
            user: user.email,
          })
        })
        .catch((err) => {
          console.error(err)
          setStatus('error')
        })
    }

    return (
      <>
        <DatePicker
          state={state}
          rentalLength={rentalLengths[state.oneTime]}
          dispatch={dispatch}
        />

        <SelectorItem label="Size" className="my-2 z-10 w-full">
          {chartOpen && (
            <SizeChart
              measurements={data.sizeChart.measurements}
              product={product}
              chart={data.sizeChart.chart}
              sizeEnum={data.sizeChart.sizeEnum}
              close={() => setChartOpen(false)}
            />
          )}
          <div className="relative flex-row justify-start space-x-4 items-center w-full">
            {/* select elements are too difficult to style
                divs don't act like buttons
                buttons can't use aria-role
            */}
            <SizeSelector dispatch={dispatch} product={product} state={state} />
            <button onClick={() => setChartOpen((state) => !state)}>
              <span className="underline">Size Chart</span>
            </button>
          </div>
        </SelectorItem>

        <SelectorItem label="Rental time" className="my-2">
          <div className="flex-row justify-between w-full flex-wrap">
            <div className="mr-6">
              <OneTimeRadioButton
                selected={state.oneTime === 'Short'}
                oneTime="Short"
                dispatch={dispatch}
              />
              <OneTimeRadioButton
                selected={state.oneTime === 'Long'}
                oneTime="Long"
                dispatch={dispatch}
              />
            </div>
            <button
              className="flex flex-grow border border-gray py-2 px-2 rounded-sm rounded-sm flex-row flex-grow justify-between items-center"
              onClick={() => dispatch(shopActions.showDate())}
            >
              <span>
                {state.selectedDate &&
                  state.selectedDate.format('ddd M/D') +
                    ' - ' +
                    state.selectedDate
                      .add(rentalLengths[state.oneTime], 'day')
                      .format('ddd M/D')}
              </span>
              <Icon className="text-gray" name="date" size={24} />
            </button>
          </div>
        </SelectorItem>

        <Submit
          onSubmit={addToCart}
          className="my-2 self-center rounded-sm w-full"
          disabled={
            process.env.NODE_ENV === 'production' ||
            !state.selectedDate ||
            !user ||
            state.size === undefined ||
            status === 'adding'
          }
        >
          {process.env.NODE_ENV === 'production'
            ? 'Coming Soon'
            : !user
            ? 'Please sign in'
            : status === 'adding'
            ? 'Adding...'
            : status === 'error'
            ? 'Unable to add to cart'
            : 'Add to Cart'}
        </Submit>
      </>
    )
  },

  Membership: () => (
    <div className="justify-center items-center flex-grow h-64">
      <span className="font-subheader text-center text-3xl">Coming Soon</span>
    </div>
  ),

  Purchase: () => (
    <div className="justify-center items-center flex-grow h-64">
      <span className="font-subheader text-center text-3xl">Coming Soon</span>
    </div>
  ),
}

const SizeSelector = ({ product, state, dispatch }) => {
  const [sizeState, setSizeState] = React.useState(false)

  return (
    <div>
      <button
        tabIndex={0}
        aria-label="Dropdown product sizes"
        className="flex p-2 border border-gray relative cursor-pointer w-32 justify-between flex-row"
        onClick={() => setSizeState((state) => !state)}
      >
        {(state.size !== undefined &&
          product.sizes[state.size] !== undefined &&
          product.sizes[state.size].size) ||
          'Select Size'}
        <Icon name="down" size={16} className="mt-1" />
      </button>
      <div
        className={`
        w-32 absolute bottom-0 bg-white divide-y transform translate-y-full border border-gray z-10
        ${sizeState ? '' : 'hidden'}
        `}
      >
        {product.sizes.map((size: Size, index: number) => (
          <button
            key={size.id}
            tabIndex={0}
            aria-label="Dropdown sizes"
            onClick={() => {
              dispatch(shopActions.changeSize(index))
              setSizeState(false)
            }}
            className="flex justify-center cursor-pointer bg-white"
          >
            {size.size}
          </button>
        ))}
      </div>
    </div>
  )
}

const SizeChart = ({ product, sizeEnum, chart, close, measurements }) => {
  return (
    <div
      className="absolute bg-white border-gray border p-4 z-10 pt-8 space-y-4 overflow-y-scroll"
      style={{ maxHeight: 600 }}
    >
      <button onClick={close} className="absolute top-0 right-0">
        <div className="p-4">
          <Icon name="close" size={16} />
        </div>
      </button>

      <table className="table-fixed border border-gray-light">
        <thead className="border border-gray-light">
          <tr className="border-b border-gray-light">
            <th colSpan={chart.length + 1}>Womens Clothing</th>
          </tr>
          <tr className="border-b border-gray-light">
            <th scope="col" />
            {chart.map((item) => (
              <th key={item.name} scope="col" className="w-12">
                {item.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="p-2">
          {sizeEnum.map((size) => (
            <tr key={size} className="border-t border-gray-light">
              <th scope="row" className="p-1">
                {size}
              </th>
              {chart.map((item) => (
                <td key={item.name} className="text-center">
                  {item[size] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <table className="table-fixed border border-gray-light">
        <thead className="border border-gray-light">
          <tr className="border-b border-gray-light">
            <th colSpan={chart.length + 1}>{product.name} Measurements</th>
          </tr>
          <tr className="border-b border-gray-light">
            <th scope="col" />
            {measurements.map((measurement) => (
              <th key={measurement} className="text-center">
                {toTitleCase(measurement)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="p-2">
          {product.sizes.map((size) => (
            <tr key={size.id} className="border-t border-gray-light">
              <th scope="row" className="p-1">
                {size.sizeRange ? `${size.size}/${size.sizeRange}` : size.size}
              </th>
              {measurements.map((measurement) => (
                <td key={measurement} className="text-center">
                  {size[measurement] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const SelectorItem = ({ label, children, ...props }) => (
  <div {...props}>
    <span className="font-bold my-2">{label}</span>
    {children}
  </div>
)

const OneTimeRadioButton = ({ selected, oneTime, dispatch }) => (
  <button
    className="flex-row flex items-center"
    onClick={() => dispatch(shopActions.changeOneTime(oneTime))}
  >
    <div className="w-4 h-4 rounded-full border border-gray items-center justify-center mr-2">
      <div
        className={`w-3 h-3 rounded-full
        ${selected ? 'bg-sec-light' : ''}
        `}
      />
    </div>
    {/* TODO: dynamic from server */}
    <span>{{ Short: 4, Long: 8 }[oneTime]}-day rental</span>
  </button>
)
