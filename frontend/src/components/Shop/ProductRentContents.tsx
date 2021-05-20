import React from 'react'
import axios from 'axios'

import { useDispatch, useSelector } from '@/utils/store'
import { Icon, CallToAction } from '@/components'
import {Submit} from '@/Form'

import { shopActions } from './slice'
import { OneTime } from './types'
import DatePicker from './DatePicker'

export const ProductRentContents = ({ product, state }) => {
  const Contents = productRentContents[state.rentType]
  const user = useSelector((state) => state.account.user)
  const dispatch = useDispatch()

  return (
    <div className="h-64">
      <Contents
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

const productRentContents = {
  OneTime: ({ dispatch, product, state, user }) => {
    const defaultSize = {
      size: 'MD',
    }

    const addToCart = () => {
      axios
        .post(
          '/orders',
          {
            quantity: state.quantity,
            size: (
              product.sizes.find((v) => v.id === state.size) ?? defaultSize
            ).size,
            date: state.selectedDate.toJSON(),
            rentalLength: state.oneTime,
            product: product.id,
          },
          { withCredentials: true },
        )
        .catch((err) => {
          console.error(err)
        })
    }

    return (
      <>
        <DatePicker
          state={state}
          rentalLength={rentalLengths[state.oneTime]}
          dispatch={dispatch}
        />

        <SelectorItem label="Size" className="my-2 z-10 w-24">
          {/* TODO: pick a size*/}
          {/* <DropDownPicker */}
          {/*   containerStyle={{ zIndex: 10 }} */}
          {/*   style={{ zIndex: 10 }} */}
          {/*   items={product.sizes.map((v: { id: string } & unknown) => ({ */}
          {/*     ...v, */}
          {/*     value: v.id, */}
          {/*   }))} */}
          {/*   itemStyle={{ justifyContent: 'flex-start' }} */}
          {/*   placeholder="Select" */}
          {/*   onChangeItem={(item) => dispatch(shopActions.changeSize(item.id))} */}
          {/* /> */}
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
          onClick={addToCart}
          className="my-2 self-center rounded-sm w-full"
          disabled={!state.selectedDate}
        >
          Add to Closet
        </Submit>
      </>
    )
  },

  Membership: () => (
    <div className="justify-center items-center flex-grow">
      <span className="font-subheader text-center text-3xl">Coming Soon!</span>
    </div>
  ),

  Purchase: () => (
    <div className="justify-center items-center flex-grow">
      <span className="font-subheader text-center text-3xl">Coming Soon!</span>
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
