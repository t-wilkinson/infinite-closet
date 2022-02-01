import React from 'react'
import { toast } from 'react-toastify'

import * as sizing from '@/utils/sizing'
import { createDateFormat } from '@/utils/dayjs'
import useAnalytics from '@/utils/useAnalytics'
import { CartUtils } from '@/Cart/slice'
import { Form, Submit, Warning } from '@/Form'
import { Icon, iconDate } from '@/Icons'
import { Dayjs, Size } from '@/types'
import { rentalLengths } from '@/utils/config'
import { useDispatch, useSelector } from '@/utils/store'
import { Button } from '@/components'

import { SizeChartPopup, SizeSelector } from './Size'
import { shopActions } from './slice'
import DatePicker from './DatePicker'

export const AddToCart = ({ fields, product }) => {
  const user = useSelector((state) => state.user.data)
  const Contents = productRentContents[fields.value('rentType')]
  const dispatch = useDispatch()

  return (
    <Contents
      fields={fields}
      user={user}
      product={product}
      dispatch={dispatch}
    />
  )
}

export const productRentContents = {
  OneTime: ({ user, dispatch, product, fields }) => {
    const state = useSelector((state) => state.shop)
    const analytics = useAnalytics()

    React.useEffect(() => {
      const hasSize = (size: Size) => sizing.get(product.sizes, size)
      if (user?.dressSize && hasSize(user.dressSize)) {
        fields.get('size').setValue(user.dressSize)
      } else if (!hasSize(fields.get('size').value) && product.sizes[0]) {
        fields.get('size').setValue(product.sizes[0].size)
      }
    }, [user])

    const prepareOrder = () => {
      const size = sizing.get(product.sizes, fields.get('size').value)
      const selectedDate = fields.get('selectedDate').value
      const rentalLength = fields.get('rentalLength').value

      const order: any = {
        user: user ? user.id : null,
        size: sizing.unnormalize(size.size),
        product: product.id,
        startDate: selectedDate ? selectedDate.toJSON() : undefined,
        rentalLength: rentalLength ? rentalLength : undefined,
      }
      return order
    }

    const addToCart = async () => {
      const order = { ...prepareOrder(), status: 'cart' }

      return dispatch(CartUtils.add(order))
        .then(() => {
          toast.success(`Successfully added to cart.`, {
            autoClose: 1500,
            hideProgressBar: true,
          }),
            analytics.logEvent('add_to_cart', {
              user: user ? user.email : 'guest',
              items: [order],
            })
        })
        .catch(() => {
          toast.error(`Unable to add to cart`, {})
        })
    }

    const addToFavorites = async () => {
      try {
        const order = { ...prepareOrder(), status: 'list' }
        await dispatch(CartUtils.add(order))
        await dispatch(CartUtils.favorites())
        toast.success(`Successfully added to favorites.`, {
          autoClose: 1500,
          hideProgressBar: true,
        })
        analytics.logEvent('add_to_favorites', {
          user: user ? user.email : 'guest',
          items: [order],
        })
      } catch (e) {
        toast.error(
          `Ran into an issue adding to favorites. We'll have this fixed soon!`,
          {}
        )
      }
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

    const quantity = sizing.get(
      product.sizes,
      fields.get('size').value
    )?.quantity

    return (
      <Form
        fields={fields}
        onSubmit={addToCart}
        redirect={user ? '/buy' : '/account/checkout/register'}
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
          form={fields.form}
          className="my-2 self-center rounded-sm w-full"
          disabled={fields.form.value === 'success'}
        >
          {quantity === 0 ? 'Pre-Order' : 'Add to Cart'}
        </Submit>
        <Button
          role="secondary"
          onClick={() => {
            addToFavorites()
          }}
        >
          Add to Favorites
        </Button>
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

export const SelectRentalSize = ({ size, selectedDate, product }) => {
  const [chartOpen, setChartOpen] = React.useState<boolean>(false)

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
            // Reset date in case new size isn't valid, should do a more sophisticated check eventually
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
  const fmtDate = createDateFormat('ddd M/D', { 'en-gb': 'ddd D/M' })
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
                fmtDate(selectedDate.value) +
                  ' - ' +
                  fmtDate(
                    selectedDate.value.add(
                      rentalLengths[rentalLength.value] + 1,
                      'day'
                    )
                  )}
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
    <span>{{ short: 4, long: 8 }[value]}-day rental</span>
  </button>
)

export default AddToCart
