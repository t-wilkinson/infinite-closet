import React from 'react'

import { FieldValue, UseField } from '@/Form'
import { Icon, iconDown } from '@/Components/Icons'

import Input from './Input'

export const Dropdown = ({
  field,
  values,
  ...props
}: {
  field: UseField
  values: { key: FieldValue; label: FieldValue }[]
  [x: string]: any
}) => {
  const [dropdown, setDropdown] = React.useState(false)

  return (
    <div
      className="relative w-full"
      tabIndex={0}
      onBlur={(e) => {
        // @ts-ignore
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setDropdown(false)
        }
      }}
    >
      <div
        className="relative"
        onClick={() => {
          setDropdown((state) => !state)
        }}
      >
        <Input
          {...props}
          className="cursor-pointer w-full"
          field={field}
          value={values.find((v) => v.key == field.value)?.label || null}
          after={<Icon icon={iconDown} size={16} className="mt-1 mr-2" />}
        />
        <div className="absolute inset-0 cursor-pointer" />
      </div>
      <div
        className={`
        w-full absolute bg-white divide-y transform translate-y-full border border-gray z-20 overflow-y-auto
        ${dropdown ? '' : 'hidden'}
        `}
        style={{ bottom: 9, maxHeight: 256 }}
      >
        {values.map((v) => (
          <button
            // @ts-ignore
            key={v.key}
            tabIndex={0}
            aria-label="Dropdown sizes"
            type="button"
            onClick={() => {
              setDropdown(false)
              field.setValue(v.key)
            }}
            className={`flex cursor-pointer bg-white px-2 hover:bg-gray-light
              ${v.key === field.value ? 'bg-gray-light' : ''}
            `}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Dropdown
