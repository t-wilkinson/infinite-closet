import React from 'react'
import { useRouter } from 'next/router'
import { Dayjs } from 'dayjs'

import * as sizing from '@/utils/sizing'
import useAnalytics from '@/utils/useAnalytics'
import { CartUtils } from '@/Cart/slice'
import { Form, Submit, useFields, Warning } from '@/Form'
import { Icon, iconDate } from '@/Icons'
import { Size } from '@/types'
import { rentalLengths } from '@/utils/config'
import { useDispatch, useSelector } from '@/utils/store'

import { SizeChartPopup, SizeSelector } from './Size'
import { shopActions } from './slice'
import DatePicker from './DatePicker'
import { RentalLength } from './types'

export const AddToCart = ({ product }) => {
  const router = useRouter()
  const rentType = useSelector((state) => state.shop.rentType)
  const user = useSelector((state) => state.user.data)

  const Contents = productRentContents[rentType]
  const dispatch = useDispatch()

  return (
    <Contents
      router={router}
      user={user}
      product={product}
      dispatch={dispatch}
    />
  )
}

export const productRentContents = {
  OneTime: ({ user, dispatch, product, router }) => {
    const [chartOpen, setChartOpen] = React.useState<boolean>(false)
    const state = useSelector((state) => state.shop)
    const analytics = useAnalytics()
    const fields = useFields<{
      size: Size
      selectedDate: Dayjs
      rentalLength: RentalLength
    }>({
      size: { constraints: 'required' },
      selectedDate: {
        label: 'Rental Date',
        constraints: 'required',
        default: null,
      },
      rentalLength: { constraints: 'required', default: 'short' },
    })

    React.useEffect(() => {
      const hasSize = (size: Size) => sizing.get(product.sizes, size)
      if (user?.dressSize && hasSize(user.dressSize)) {
        fields.get('size').setValue(user.dressSize)
      } else if (!hasSize(fields.get('size').value) && product.sizes[0]) {
        fields.get('size').setValue(product.sizes[0].size)
      }
    }, [user])

    const addToCart = async () => {
      const size = sizing.get(product.sizes, fields.get('size').value)
      const selectedDate = fields.get('selectedDate').value
      const rentalLength = fields.get('rentalLength').value

      const order: any = {
        user: user ? user.id : null,
        status: 'cart',
        size: sizing.unnormalize(size.size),
        product: product.id,
        startDate: selectedDate.toJSON(),
        rentalLength,
      }

      return dispatch(CartUtils.add(order))
        .then(() => {
          analytics.logEvent('add_to_cart', {
            user: user ? user.email : 'guest',
            items: [order],
          })
        })
        .catch(() => {
          throw 'Unable to add to your cart'
        })
    }

    // React.useEffect(() => {
    //   var settings = {
    //     integration_code: 'SC-A8B4CC5D',
    //     retailer_token: 'EfrpfcDJyCWwju2rrf6fqz2t',
    //   }
    //   var s = document.createElement('script')
    //   s.src = 'https://widget.mysz.io/v1/assets/js/mysize-connect.js'
    //   s.async = true
    //   // @ts-ignore
    //   window.MYSIZE = Object.assign(window.MYSIZE || {}, settings)
    //   document.body.appendChild(s)
    // }, [])

    return (
      <Form
        fields={fields}
        onSubmit={addToCart}
        redirect={user ? '/user/checkout' : '/account/checkout/register'}
      >
        <DatePicker
          size={fields.value('size')}
          product={product}
          selectedDate={fields.value('selectedDate')}
          selectDate={(date: Dayjs) => {
            fields.get('selectedDate').setValue(date)
          }}
          visible={state.dateVisible}
          setVisible={(visible: boolean) =>
            dispatch(shopActions.setDateVisibility(visible))
          }
          rentalLength={fields.value('rentalLength')}
        />

        <SelectRentalSize
          size={fields.get('size')}
          selectedDate={fields.get('selectedDate')}
          product={product}
          chartOpen={chartOpen}
          setChartOpen={setChartOpen}
        />
        <SelectRentalDate
          size={fields.get('size')}
          rentalLength={fields.get('rentalLength')}
          selectedDate={fields.get('selectedDate')}
          setVisible={(visible: boolean) =>
            dispatch(shopActions.setDateVisibility(visible))
          }
        />

        <Submit
          field={fields.form}
          className="my-2 self-center rounded-sm w-full"
          disabled={fields.form.value === 'success'}
        >
          Add to Cart
        </Submit>
      </Form>
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

export const SelectRentalSize = ({
  size,
  selectedDate,
  product,
  chartOpen,
  setChartOpen,
}) => {
  if (size.value === 'ONESIZE') {
    return null
  }

  return (
    <SelectorItem label="Size" className="my-2 w-full" errors={size.errors}>
      <div className="z-30">
        <SizeChartPopup
          product={product}
          state={chartOpen}
          setState={setChartOpen}
        />
      </div>
      <div className="relative flex-row justify-start space-x-4 items-center w-full">
        <SizeSelector
          onChange={(newSize: Size) => {
            size.setValue(newSize)
            selectedDate.setValue(null)
          }}
          product={product}
          size={size.value}
        />
        <button
          onClick={() => setChartOpen((state: boolean) => !state)}
          type="button"
        >
          <span className="underline">Size Chart</span>
        </button>
      </div>
      {/* <div className="relative"> */}
      {/*   <div id="mySize" /> */}
      {/* </div> */}
    </SelectorItem>
  )
}

export const SelectRentalDate = ({
  rentalLength,
  size,
  selectedDate,
  setVisible,
}) => {
  return (
    <SelectorItem
      label="Rental time"
      className="my-2"
      errors={selectedDate.errors.concat(rentalLength.errors)}
    >
      <div className="flex-row justify-between w-full flex-wrap">
        <div className="mr-6">
          <RadioButton field={rentalLength} value="short" />
          <RadioButton field={rentalLength} value="long" />
        </div>
        {size.value !== undefined && (
          <button
            aria-label="Date selector"
            type="button"
            className="flex flex-grow border border-gray py-2 px-2 rounded-sm rounded-sm flex-row flex-grow justify-between items-center"
            onClick={() => setVisible(true)}
          >
            <span>
              {selectedDate.value &&
                selectedDate.value.format('ddd M/D') +
                  ' - ' +
                  selectedDate.value
                    .add(rentalLengths[rentalLength.value] + 1, 'day')
                    .format('ddd M/D')}
            </span>
            <Icon className="text-gray" icon={iconDate} size={24} />
          </button>
        )}
      </div>
    </SelectorItem>
  )
}

const SelectorItem = ({ label, children, errors, ...props }) => (
  <div {...props}>
    <span className="font-bold my-2">{label}</span>
    {children}
    <Warning warnings={errors} />
  </div>
)

const RadioButton = ({ field, value }) => (
  <button
    className="flex-row flex items-center"
    onClick={() => field.setValue(value)}
    type="button"
    aria-label={`Select ${field.value} rental length`}
  >
    <div className="w-4 h-4 rounded-full border border-gray items-center justify-center mr-2">
      <div
        className={`w-3 h-3 rounded-full
        ${field.value === value ? 'bg-sec-light' : ''}
        `}
      />
    </div>
    {/* TODO: dynamic from server */}
    <span>{{ short: 4, long: 8 }[value]}-day rental</span>
  </button>
)

export default AddToCart
