import React from 'react'

import { Icon } from '@/components'

import { validate } from './useFields'

export const Checkbox = ({
  value = false,
  onChange,
  label,
  color = undefined,
  children = undefined,
}) => (
  <button
    onClick={() => onChange(!value)}
    aria-label={`Toggle ${label} checkbox`}
  >
    <div className="flex-row flex-wrap items-center">
      <div className="items-center justify-center w-5 h-5 bg-white border border-black rounded-sm">
        {value && <Icon name="check" className="w-3 h-3" style={{ color }} />}
      </div>
      &nbsp;&nbsp;
      <span>{label}</span>
      {children}
    </div>
  </button>
)

export const Input = ({
  field,
  label,
  onChange,
  constraints,
  value,
  type,
  children = undefined,
  className = '',
}) => {
  const [changed, setChanged] = React.useState(false)
  const onChange_ = (e) => {
    setChanged(true)
    onChange(e.target.value)
  }
  const [focused, setFocused] = React.useState(false)
  const validations = validate(label, value, constraints)

  return (
    <div className={`relative my-1 py-1 w-full h-full ${className}`}>
      <div
        className="relative"
        onFocus={() => {
          setFocused(true)
        }}
        onBlur={() => {
          setFocused(false)
          setChanged(true)
        }}
      >
        <label
          htmlFor={field}
          className={`bg-white rounded-sm border-sec absolute z-10 left-0 m-2 my-4 px-1 transform duration-200 pointer-events-none
          ${focused ? 'text-sec' : 'text-gray'}
          `}
          style={{
            bottom: -2,
            ...(focused || value
              ? { transform: 'translate(-5px, -24px) scale(0.9)' }
              : {}),
          }}
        >
          {changed && validations.length ? (
            <Warning>{validations[0]}</Warning>
          ) : (
            label
          )}
        </label>

        <div
          className={`w-full h-full flex-row justify-between border rounded-sm transform duration-200
            ${focused ? 'border-sec' : ''}
            ${
              changed && validations.length > 0
                ? 'border-warning'
                : 'border-gray'
            }
            `}
        >
          <input
            className={`p-2 py-3 outline-none w-full h-full
            `}
            id={field}
            name={field}
            type={type}
            value={value}
            onChange={onChange_}
          />
          {children}
        </div>
      </div>
    </div>
  )
}

export const Warnings = ({ warnings }) =>
  warnings.map((warning) => <Warning key={warning}>{warning}</Warning>)

export const Warning = ({ children }) => (
  <span className="font-bold text-sm text-warning">{children}</span>
)

export const Form = ({
  onSubmit = (..._: any[]) => {}, // eww
  className = '',
  children,
}) => (
  <div
    className={`items-center h-full w-full bg-gray-light flex-grow ${className}`}
  >
    <form
      className="w-full max-w-sm"
      onSubmit={(e) => {
        onSubmit(e)
        e.preventDefault()
      }}
    >
      <div className="w-full p-6 bg-white rounded-lg shadow-md">{children}</div>
    </form>
  </div>
)

export const FormHeader = ({ label }) => (
  <>
    <div className="items-center text-pri -mb-6">
      <Icon name="logo" size={64} />
    </div>
    <span className="text-center font-subheader-light text-3xl mb-6">
      {label}
    </span>
  </>
)

export const Submit = ({
  children = 'Submit' as any,
  disabled = false,
  onSubmit = () => {},
}) => (
  <button
    aria-label="Submit form"
    className={`p-4 text-white mt-4 rounded-sm inline
      ${disabled ? 'bg-pri-light' : 'bg-pri'}
    `}
    type="submit"
    onClick={onSubmit}
    disabled={disabled}
  >
    {children}
  </button>
)

export const OR = () => (
  <div className="flex-row items-center">
    <div className="h-px bg-gray flex-grow" />
    <span className="mx-5 my-4 text-gray">OR</span>
    <div className="h-px bg-gray flex-grow" />
  </div>
)

export const PasswordVisible = ({ passwordVisible, setPasswordVisible }) => (
  <button
    aria-label="Toggle password visibility"
    className="flex flex-row items-center absolute right-0 h-full pr-2"
    type="button"
    onClick={() => setPasswordVisible(!passwordVisible)}
  >
    {passwordVisible ? (
      <Icon name="eye" size={24} />
    ) : (
      <Icon name="eye-hidden" size={24} />
    )}
  </button>
)

export default Form