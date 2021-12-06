import React from 'react'
import Warning from './Warning'

const InputWrapper = ({
  tag: Tag='input',
  field,
  type = 'text',
  before = null,
  after = null,
  children = null,
  className = '',
  disabled = false,
  ...props
}) => {
  const [changed, setChanged] = React.useState(false)
  const [focus, setFocus] = React.useState(false)
  // Only show outline when navigating by keyboard
  const [focused, setFocused] = React.useState(false)
  const [mouse, setMouse] = React.useState(false)
  const required = /required/.test(field.constraints)
  const inputProps = {
    ...props,
    disabled: disabled,
    className: `p-2 py-3 w-full h-full outline-none `,
    placeholder: focused ? field.placeholder : '',
    id: field.name,
    name: field.name,
    type: field.type,
    value: field.value,
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
      className={`relative my-2 w-full
        ${className}
        ${focus ? 'outline-black' : ''}
        `}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <label
        htmlFor={field}
        className={`rounded-sm border-sec absolute z-10 left-0 px-2
          transform duration-200 pointer-events-none w-full flex
          items-center overflow-hidden
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
        className={`w-full h-full flex-row justify-between items-center border rounded-sm transform duration-200
          ${disabled ? 'bg-gray-light' : 'bg-white'}
          ${focused ? 'border-sec' : ''}
          ${
            changed && field.errors.length > 0
              ? 'border-warning'
              : 'border-gray'
          }
        `}
      >
        {before && <div>{before}</div>}
        <Tag {...inputProps} />
        {children}
        {after && <div>{after}</div>}
      </div>
      <Warning warnings={field.errors} />
    </div>
  )
}

export const Input = (props: any) =>
  <InputWrapper {...props} tag="input" />

export const Textarea = (props: any) => <InputWrapper {...props} tag="textarea" />

export default Input
