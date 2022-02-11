import React from 'react'

import { Dayjs, Size } from '@/types'
import { StrapiProduct } from '@/types/models'
import { createDateFormat } from '@/utils/dayjs'
import * as sizing from '@/utils/sizing'

import { Icon, iconDate } from '@/Components/Icons'
import { SizeChartPopup } from '@/Product/SizeChart'
import { Warning } from '@/Form'
import { DatePicker as DatePickerForm } from '@/Form/DatePicker'
import { availableOrderDates, getRentalLength } from '@/Order'

// const dateLegend = [
//   { color: 'bg-sec', text: 'You will have access on these days' },
// ]

export const DatePicker = ({ fields, product }) => {
  const [validDates, setValidDates] = React.useState({})

  const onDateChange = async (date: Dayjs) => {
    const size = fields.value('size')
    const rentalLength = fields.value('rentalLength')
    const newValidDates = await availableOrderDates({
      size,
      product,
      rentalLength,
      date,
    })
    setValidDates({ ...validDates, ...newValidDates })
  }

  return (
    <DatePickerForm
      onDateChange={onDateChange}
      selectedDate={fields.get('selectedDate')}
      visible={fields.get('visible')}
      length={getRentalLength(fields.value('rentalLength')) + 1}
      isValid={(date) => validDates[date.toJSON()]}
      footer={
        <div className="w-full items-center pt-6">
          <small>We recommend ordering 1-2 days before your event.</small>
          {/* <div className="grid grid-rows-2 grid-cols-2 gap-4"> */}
            {/* {dateLegend.map(({color, text}) => */}
            {/* <span> */}
            {/* <div className="bg-sec w-8 h-8" key={color} /> */}
            {/*   {text} */}
            {/* </span> */}
            {/* )} */}
          {/* </div> */}
        </div>
      }
    />
  )
}

interface SizeSelector {
  product: StrapiProduct
  size: Size
  onChange: (size: Size) => void
}

export const SizeSelector = ({
  product,
  size: currentSize,
  onChange,
}: SizeSelector) => {
  return (
    <>
      {sizing.range(product.sizes).map((size: Size) => (
        <button
          key={size}
          tabIndex={0}
          aria-label="Dropdown sizes"
          type="button"
          onClick={() => {
            onChange(size)
          }}
          className={`flex border border-gray-dark w-10 h-10 items-center justify-center cursor-pointer rounded-md
        ${currentSize === size ? 'bg-pri-light font-bold' : ''}
      `}
        >
          {size}
        </button>
      ))}
    </>
  )
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
                      getRentalLength(rentalLength.value) + 1,
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
