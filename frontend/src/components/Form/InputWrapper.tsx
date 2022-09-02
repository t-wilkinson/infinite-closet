import React from 'react'

import Warning from './Warning'
import { UseField } from './types'

export type InputProps = {
  field: UseField<any>
  tag?: string
  type?: string
  before?: React.ReactNode
  after?: React.ReactNode
  children?: React.ReactNode
  disabled?: boolean
  value?: any
  className?: string
} & React.HTMLProps<HTMLInputElement>

export const getInputProps = (
  field: UseField,
  { value = field?.value, onChange = () => {}}: {
    value?: InputProps['value']
    onChange?: InputProps['onChange']
  } = {}
) => ({
  value: value || '',
  id: field.name,
  name: field.name,
  autoComplete: field.autocomplete,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e)
    field.setValue(e.target.value)
  },
})

export const InputWrapper = ({
  tag = 'input',
  field,
  type = 'text',
  before = null,
  after = null,
  children = null,
  className = '',
  disabled = false,
  value = field?.value,
  ...props
}: InputProps) => {
  const [changed, setChanged] = React.useState(false)
  const [focus, setFocus] = React.useState(false)
  // Only show outline when navigating by keyboard
  const [focused, setFocused] = React.useState(false)
  const [mouse, setMouse] = React.useState(false)
  const required = /required/.test(field.constraints)
  const inputProps = {
    ...props,
    ...getInputProps(field, { value, onChange: () => setChanged(true) }),
    className: `px-2 py-3 w-full outline-none`,
    disabled,
    type,
    placeholder: focused ? field.placeholder : '',
    // Only show outline when navigating by keyboard
    onMouseDown: () => setMouse(true),
    onMouseUp: () => setMouse(false),
    onFocus: () => !mouse && setFocus(true),
    onBlur: () => setFocus(false),
  }
  const Tag = tag as any

  return (
    <div
      className={`relative flex-col
        ${className}
        ${focus ? 'outline-black' : ''}
      `}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <Label
        field={field}
        focused={focused}
        disabled={disabled}
        required={required}
      />
      <InnerWrapper
        disabled={disabled}
        focused={focused}
        changed={changed}
        field={field}
      >
        {before}
        <Tag {...inputProps} />
        {children}
        {after}
      </InnerWrapper>
      <Warning warnings={field.errors} />
    </div>
  )
}

export const InnerWrapper = ({ children, disabled, focused, changed, field }) => (
  <div
    className={`w-full flex-row justify-between items-center border
          rounded-sm transform duration-200
          ${disabled ? 'bg-gray-light' : 'bg-white'}
          ${focused ? 'border-sec' : ''}
          ${
            changed && field.errors.length > 0
              ? 'border-warning'
              : 'border-gray'
          }
        `}
  >
    {children}
  </div>
)

export const Label = ({ field, focused, disabled, required }) => (
  <label
    htmlFor={field.name}
    className={`rounded-sm border-sec
    transform duration-200 pointer-events-none w-full flex
    absolute z-10 left-0 px-2 text-base
    items-center
    ${focused ? 'text-sec' : 'text-gray'}
    `}
    style={{
      ...(focused || field.value
        ? { transform: 'translate(-5%, -50%) scale(0.9)' }
        : { transform: 'translate(-0px, 100%) ' }),
    }}
  >
    <span
      className={`px-1 leading-none
      ${disabled ? 'bg-gray-light' : 'bg-white'} `}
    >
      {field.label}
      {required ? <span className="text-base">*</span> : null}
    </span>
  </label>
)


