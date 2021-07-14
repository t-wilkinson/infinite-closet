import React from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import useAnalytics from '@/utils/useAnalytics'
import { useDispatch, useSelector } from '@/utils/store'
import { Icon } from '@/components'
import { Submit } from '@/Form'
import { sizeIndex, unNormalizeSize } from '@/Products/helpers'
import { rentalLengths } from '@/utils/constants'
import { userActions } from '@/User/slice'

import { SizeChartPopup, SizeSelector } from './Size'
import { shopActions } from './slice'
import DatePicker from './DatePicker'

export const ProductRentContents = ({ data, product, state }) => {
  const router = useRouter()
  const Contents = productRentContents[state.rentType]
  const user = useSelector((state) => state.user.data)
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (user?.dressSize) {
      const index = sizeIndex(product.sizes, user.dressSize)
      if (!isNaN(index) && index >= 0) {
        dispatch(shopActions.changeSize(index))
      }
    }
  }, [user])

  return (
    <Contents
      data={data}
      router={router}
      user={user}
      product={product}
      state={state}
      dispatch={dispatch}
    />
  )
}
export default ProductRentContents

export const productRentContents = {
  OneTime: ({ data, user, dispatch, product, state, router }) => {
    const [status, setStatus] = React.useState<null | string>(null)
    const [chartOpen, setChartOpen] = React.useState(false)
    const analytics = useAnalytics()

    const addToCart = () => {
      setStatus('adding')
      const size = product.sizes[state.size]
      if (!size) {
        setStatus('error')
      }

      axios
        .post(
          '/orders',
          {
            status: 'cart',
            size: unNormalizeSize(size.size),
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
        .then(() => axios.get(`/orders/cart/count`, { withCredentials: true }))
        .then((res) => dispatch(userActions.countCart(res.data.count)))
        .catch((err) => {
          console.error(err)
          setStatus('error')
        })
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
        <DatePicker
          state={state}
          rentalLength={rentalLengths[state.oneTime] + 1}
          dispatch={dispatch}
        />

        <SelectorItem label="Size" className="my-2 z-10 w-full">
          <SizeChartPopup
            sizeChart={data.sizeChart}
            product={product}
            state={chartOpen}
            setState={setChartOpen}
          />
          <div className="relative flex-row justify-start space-x-4 items-center w-full">
            {/* select elements are too difficult to style
                divs don't act like buttons
                buttons can't use aria-role
            */}
            <SizeSelector dispatch={dispatch} product={product} state={state} />
            <button onClick={() => setChartOpen((state) => true)}>
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
            !user ||
            state.size === undefined ||
            status === 'adding'
          }
        >
          {!user
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
    <span>{{ short: 4, long: 8 }[oneTime]}-day rental</span>
  </button>
)
