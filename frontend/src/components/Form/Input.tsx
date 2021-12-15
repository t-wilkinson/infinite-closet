import React from 'react'

import Warning from './Warning'
import {UseField} from './types'

export type Input = {
  field: UseField<any>
  tag?: string
  type?: string
  before?: React.ReactNode
  after?: React.ReactNode
  children?: React.ReactNode
  disabled?: boolean
  value?: any
  className?: string
  [x: string]: any // React.HTMLProps<HTMLInputElement>
}

const InputWrapper = ({
  tag: Tag='input',
  field,
  type = 'text',
  before = null,
  after = null,
  children = null,
  className = '',
  disabled = false,
  value=field?.value,
  ...props
}: Input) => {
  const [changed, setChanged] = React.useState(false)
  const [focus, setFocus] = React.useState(false)
  // Only show outline when navigating by keyboard
  const [focused, setFocused] = React.useState(false)
  const [mouse, setMouse] = React.useState(false)
  const required = /required/.test(field.constraints)
  const inputProps = {
    ...props,
    disabled,
    type,
    value: value || '',
    className: `px-2 py-3 w-full outline-none`,
    placeholder: focused ? field.placeholder : '',
    id: field.name,
    name: field.name,
    autoComplete: field.autocomplete,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setChanged(true)
      field.setValue(e.target.value)
    },
    // Only show outline when navigating by keyboard
    onMouseDown: () => setMouse(true),
    onMouseUp: () => setMouse(false),
    onFocus: () => !mouse && setFocus(true),
    onBlur: () => setFocus(false),
  }

  return (
    <div
      className={`relative w-full
        ${className}
        ${focus ? 'outline-black' : ''}
      `}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
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
        {before}
        <Tag {...inputProps} />
        {children}
        {after}
      </div>
      <Warning warnings={field.errors} />
    </div>
  )
}

export const Input = (props: Input) =>
  <InputWrapper {...props} tag="input" />

export const Textarea = (props: Input) => <InputWrapper {...props} tag="textarea" />

export default Input
