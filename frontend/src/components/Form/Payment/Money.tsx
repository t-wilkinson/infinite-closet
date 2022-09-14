import React from 'react'

import { getInputProps } from '@/Form/InputWrapper'
import { UseField } from '@/Form/types'

export const Money = ({ amounts, field }) => {
  const inputProps = getInputProps(field)
  return (
    <div className="flex-row w-24 h-10 items-center border border-gray rounded-sm">
      <div className="bg-gray-light h-full px-2 justify-center border-r border-gray">
        $
      </div>
      <input
        {...inputProps}
        value={amounts.includes(field.value) ? '' : inputProps.value}
        placeholder="Other"
        className="px-2 outline-none w-full"
      />
    </div>
  )
}

export const Amounts = ({
  amounts,
  field,
}: {
  field: UseField
  amounts: number[]
}) => (
  <div className="flex-row space-x-2">
    {amounts.map((amount) => (
      <button
        key={amount}
        className={`w-10 h-10 border rounded-sm
          ${
            field.value === amount
              ? 'font-bold bg-pri-white border-pri'
              : 'border-gray'
          }`}
        onClick={() => {
          field.setValue(amount)
        }}
        type="button"
      >
        ${amount}
      </button>
    ))}
  </div>
)

export const MoneyAmounts = ({ amounts, field }) => (
  <div className="flex-row space-x-2">
    <Amounts amounts={amounts} field={field} />
    <Money amounts={amounts} field={field} />
  </div>
)
