import React from 'react'

type Valid = true | string
export const validate = (
  field: string,
  value: string,
  constraints: string,
): Valid[] => {
  const isValid = (value: string, constraint: string): Valid => {
    const [type, ...props] = constraint.split(':')
    switch (type) {
      case 'email':
        return /^.+@.+\..+$/.test(value) || `${field} must be valid`
      case 'required':
        return value.length > 0 || `${field} is required`
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

export const Input = ({
  name,
  label,
  onChange,
  constraints,
  value,
  type,
  children,
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
          htmlFor={name}
          className={`bg-white rounded-sm border-sec absolute z-10 left-0 bottom-0 m-2 my-4 px-1 transform duration-200 pointer-events-none
          ${focused || value ? '-translate-y-5 -translate-x-1 scale-90' : ''}
          ${focused ? 'text-sec' : 'text-gray'}
          `}
        >
          {label}
        </label>
        <div
          className={`w-full h-full flex-row justify-between border-2 rounded-sm
            ${
              changed && validations.length > 0
                ? 'border-warning'
                : 'border-gray focus:border-sec'
            }
            `}
        >
          <input
            className={`p-2 py-3 outline-none w-full h-full
            `}
            id={name}
            name={name}
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
    className={`p-4 text-white mt-4 rounded-sm inline ${
      disabled ? 'bg-pri-light' : 'bg-pri'
    }`}
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

// TODO: needs better type
type UseFields = (fields: {
  [field: string]: {
    constraints?: string
    label: string
    onChange?: (value: string) => void
    type?: string
  }
}) => any
export const useFields: UseFields = (config) => {
  const initialState = Object.keys(config).reduce(
    (acc, k) => ((acc[k] = ''), acc),
    {},
  )
  const reducer = (state, { type, payload }) => ({ ...state, [type]: payload })
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const valid = Object.keys(state)
    .map((field) =>
      validate(field, state[field], config[field].constraints || ''),
    )
    .every((v) => v.length === 0)

  const fields = Object.entries(config).reduce((acc, [field, v]) => {
    v = Object.assign({ type: 'text', constraints: '', onChange: () => {} }, v)
    acc[field] = {
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

  return { valid, state, ...fields }
}
