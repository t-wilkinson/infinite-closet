import React from 'react'
import { Icon } from '@/components'

// TODO: needs better type
type Field = {
  field: string
  label: string
  type: string
  value: any
  constraints: string
  onChange: (value: any) => void
}

type Fields = {
  [field: string]: Field
}

type FieldsConfig = {
  [field: string]: {
    defaultValue?: any
    constraints?: string
    label: string
    onChange?: (value: string) => void
    type?: string
  }
}

type Valid = true | string

export const validateField = (field: Field) =>
  validate(field.field, field.value, field.constraints)

export const validate = (
  field: string,
  value: string,
  constraints: string,
): Valid[] => {
  const isValid = (value: string, constraint: string): Valid => {
    const [type, ...props] = constraint.split(':')
    switch (type) {
      case 'email':
        return (
          /^.+@.+\..+$/.test(value) ||
          `Please enter a valid ${field.toLowerCase()}`
        )
      case 'required':
        return Boolean(value) || `Please include your ${field.toLowerCase()}`
      case 'number':
        return /^\d*$/.test(value) || `${field} must be a number`
      case 'max-width':
        return (
          value.length <= Number(props[0]) ||
          `${field} must be at most ${props[0]} characters long`
        )
      case 'min-width':
        return (
          value.length >= Number(props[0]) ||
          `${field} must be at least ${props[0]} characters long`
        )
      case 'regex':
        return (
          RegExp(props[0]).test(value) ||
          `${field} does not have the correct format`
        )
      case '':
        return true
      default:
        return true
    }
  }

  return constraints
    .split(' ')
    .map((constraint) => isValid(value, constraint))
    .filter((v) => v !== true)
}

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
          className={`bg-white rounded-sm border-sec absolute z-10 left-0 bottom-0 m-2 my-4 px-1 transform duration-200 pointer-events-none
          ${focused ? 'text-sec' : 'text-gray'}
          `}
          style={{
            ...(focused || value
              ? { transform: 'translate(-5px, -22px) scale(0.9)' }
              : {}),
          }}
        >
          {label}
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
      {changed && <Warning>{validations[0]}</Warning>}
    </div>
  )
}

export const Warning = ({ children }) => (
  <span className="font-bold text-sm text-warning">{children}</span>
)

export const Form = ({ className = '', children }) => (
  <div
    className={`items-center h-full w-full bg-gray-light flex-grow ${className}`}
  >
    <form className="w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
      <div className="w-full p-6 bg-white rounded-lg shadow-md">{children}</div>
    </form>
  </div>
)

export const Submit = ({ children, disabled, onSubmit }) => (
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

export const useFields: (config: FieldsConfig) => Fields = (config) => {
  const initialState = Object.keys(config).reduce(
    (acc, k) => ((acc[k] = config[k].defaultValue ?? ''), acc),
    {},
  )
  const reducer = (state, { type, payload }) => ({ ...state, [type]: payload })
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const fields = Object.entries(config).reduce((acc, [field, v]) => {
    v = Object.assign({ type: 'text', constraints: '', onChange: () => {} }, v)
    acc[field] = {
      field,
      label: v.label,
      type: v.type,
      value: state[field],
      constraints: v.constraints,
      onChange: (value: string) => {
        dispatch({ type: field, payload: value })
        v.onChange(value)
      },
    }
    return acc
  }, {})

  return fields
}

export const isValid = (fields: Fields): boolean => {
  return Object.values(fields)
    .map((field) => validate(field.label, field.value, field.constraints))
    .every((v) => v.length === 0)
}

export const cleanFields = (fields: Fields): { [field: string]: any } => {
  return Object.entries(fields).reduce((acc, [k, v]) => {
    if (typeof v.value === 'string') acc[k] = v.value.trim()
    else acc[k] = v.value
    return acc
  }, {})
}
