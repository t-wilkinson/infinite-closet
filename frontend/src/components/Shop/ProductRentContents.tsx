import React from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import useAnalytics from '@/utils/useAnalytics'
import { useDispatch, useSelector } from '@/utils/store'
import { Icon } from '@/components'
import { Submit } from '@/Form'
import * as sizing from '@/utils/sizing'
import { rentalLengths } from '@/utils/constants'
import { userActions } from '@/User/slice'
import { Size } from '@/Products/constants'
import * as CartUtils from '@/utils/cart'

import { SizeChartPopup, SizeSelector } from './Size'
import { shopActions } from './slice'
import DatePicker from './DatePicker'

export const ProductRentContents = ({ sizeChart, product }) => {
  const router = useRouter()
  const rentType = useSelector((state) => state.shop.rentType)
  const user = useSelector((state) => state.user.data)

  const Contents = productRentContents[rentType]
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (user?.dressSize) {
      user.dressSize && dispatch(shopActions.changeSize(user.dressSize as Size))
    }
  }, [user])

  return (
    <Contents
      sizeChart={sizeChart}
      router={router}
      user={user}
      product={product}
      dispatch={dispatch}
    />
  )
}

export const productRentContents = {
  OneTime: ({ sizeChart, user, dispatch, product, router }) => {
    const [status, setStatus] = React.useState<null | string>(null)
    const [chartOpen, setChartOpen] = React.useState(false)
    const state = useSelector((state) => state.shop)
    const analytics = useAnalytics()

    const addToCart = () => {
      setStatus('adding')
      const size = sizing.get(product.sizes, state.size)
      if (!size) {
        setStatus('error')
      }

      const order = {
        user: user ? user.id : null,
        status: 'cart',
        size: sizing.unnormalize(size.size),
        product: product.id,
        startDate: state.selectedDate.toJSON(),
        rentalLength: state.oneTime,
      }

      CartUtils.insert(order)
      dispatch(userActions.countCart(CartUtils.count(user?.id)))

      analytics.logEvent('add_to_cart', {
        user: user ? user.email : 'guest',
        items: [order],
      })

      if (user) {
        axios
          .put(
            `/orders/cart/${user.id}`,
            {
              cart: CartUtils.getByUser(user.id),
            },
            { withCredentials: true }
          )
          .catch((err) => console.error(err))
      }

      if (user) {
        router.push('/user/checkout')
      } else {
        router.push('/account/signin?redir=/user/checkout')
      }
    }

    //     React.useEffect(() => {
    //       var settings = {
    //         integration_code: 'SC-A8B4CC5D',
    //         retailer_token: 'EfrpfcDJyCWwju2rrf6fqz2t',
    //       }
    //       var s = document.createElement('script')
    //       s.src = 'https://widget.mysz.io/v1/assets/js/mysize-connect.js'
    //       s.async = true
    //       window.MYSIZE = Object.assign(window.MYSIZE || {}, settings)
    //       document.body.appendChild(s)
    //     }, [])

    return (
      <>
        <DatePicker />

        <SelectorItem label="Size" className="my-2 z-10 w-full">
          <SizeChartPopup
            product={product}
            state={chartOpen}
            setState={setChartOpen}
          />
          <div className="relative flex-row justify-start space-x-4 items-center w-full">
            {/* select elements are too difficult to style
                divs don't act like buttons
                buttons can't use aria-role
            */}
            <SizeSelector
              onChange={(size) => dispatch(shopActions.changeSize(size))}
              product={product}
              size={state.size}
            />
            <button onClick={() => setChartOpen((state) => !state)}>
              <span className="underline">Size Chart</span>
            </button>
          </div>
          {/* <div className="relative"> */}
          {/*   <div id="mySize" /> */}
          {/* </div> */}
        </SelectorItem>

        <SelectorItem label="Rental time" className="my-2">
          <div className="flex-row justify-between w-full flex-wrap">
            <div className="mr-6">
              <OneTimeRadioButton
                selected={state.oneTime === 'short'}
                oneTime="short"
                dispatch={dispatch}
              />
              <OneTimeRadioButton
                selected={state.oneTime === 'long'}
                oneTime="long"
                dispatch={dispatch}
              />
            </div>
            {state.size !== undefined && (
              <button
                className="flex flex-grow border border-gray py-2 px-2 rounded-sm rounded-sm flex-row flex-grow justify-between items-center"
                onClick={() => dispatch(shopActions.showDate())}
              >
                <span>
                  {state.selectedDate &&
                    state.selectedDate.format('ddd M/D') +
                      ' - ' +
                      state.selectedDate
                        .add(rentalLengths[state.oneTime] + 1, 'day')
                        .format('ddd M/D')}
                </span>
                <Icon className="text-gray" name="date" size={24} />
              </button>
            )}
          </div>
        </SelectorItem>

        <Submit
          onSubmit={addToCart}
          className="my-2 self-center rounded-sm w-full"
          disabled={
            !state.selectedDate ||
            state.size === undefined ||
            status === 'adding'
          }
        >
          {status === 'adding'
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
    aria-label={`Select ${oneTime} rental length`}
  >
    <div className="w-4 h-4 rounded-full border border-gray items-center justify-center mr-2">
      <div
        className={`w-3 h-3 rounded-full
        ${selected ? 'bg-sec-light' : ''}
        `}
      />
    </div>
    {/* TODO: dynamic from server */}
    <span>{{ short: 4, long: 8 }[oneTime]}-day rental</span>
  </button>
)

export default ProductRentContents
