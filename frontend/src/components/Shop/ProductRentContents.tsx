import React from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import { useDispatch, useSelector } from '@/utils/store'
import { Icon } from '@/components'
import { Submit } from '@/Form'

import { shopActions } from './slice'
import { OneTime } from './types'
import DatePicker from './DatePicker'

export const ProductRentContents = ({ product, state }) => {
  const router = useRouter()
  const Contents = productRentContents[state.rentType]
  const user = useSelector((state) => state.user.data)
  const dispatch = useDispatch()

  return (
    <div className="h-96">
      <Contents
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
  OneTime: ({ dispatch, product, state, router }) => {
    const [sizeState, setSizeState] = React.useState(false)
    const [status, setStatus] = React.useState<null | string>(null)

    const addToCart = () => {
      setStatus('adding')
      axios
        .post(
          '/orders',
          {
            status: 'cart',
            size: product.sizes[state.size].size,
            date: state.selectedDate.toJSON(),
            rentalLength: state.oneTime,
            product: product.id,
          },
          { withCredentials: true },
        )
        .then(() => {
          router.push('/user/checkout')
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
          <div className="relative items-start w-full">
            <button
              aria-label="Dropdown product sizes"
              className="p-2 border border-gray relative cursor-pointer w-32 justify-between flex-row"
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
                  aria-label="Dropdown sizes"
                  onClick={() => {
                    dispatch(shopActions.changeSize(index))
                    setSizeState(false)
                  }}
                  className="justify-center cursor-pointer bg-white"
                >
                  {size.size}
                </button>
              ))}
            </div>
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
            state.size === undefined ||
            status === 'adding'
          }
        >
          {process.env.NODE_ENV === 'production'
            ? 'Coming Soon'
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
    <div className="justify-center items-center flex-grow">
      <span className="font-subheader text-center text-3xl">Coming Soon</span>
    </div>
  ),

  Purchase: () => (
    <div className="justify-center items-center flex-grow">
      <span className="font-subheader text-center text-3xl">Coming Soon</span>
    </div>
  ),
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
