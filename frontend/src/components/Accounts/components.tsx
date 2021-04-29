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
        return /^\w+@\w+\.\w+$/.test(value) || `${field} must be valid`
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

export const Input = ({ name, label, dispatch, constraints, value, type }) => {
  const [changed, setChanged] = React.useState(false)
  const onChange = (e) => {
    setChanged(true)
    dispatch(e.target.value)
  }
  const [focused, setFocused] = React.useState(false)
  const validations = validate(label, value, constraints)

  return (
    <div className="my-1 py-1">
      <div
        className="relative"
        onFocus={() => {
          setFocused(true)
          setChanged(true)
        }}
        onBlur={() => setFocused(false)}
      >
        <label
          htmlFor={name}
          className={`bg-white absolute left-0 bottom-0 m-2 my-4 px-1 transform duration-200 ${
            focused || value ? '-translate-y-5 -translate-x-1 scale-90' : ''
          }
          ${focused ? 'text-sec' : 'text-gray'}
          `}
        >
          {label}
        </label>
        <input
          className={`border-2 outline-none rounded-sm p-2 py-3
            ${
              changed && validations.length > 0
                ? 'border-warning'
                : 'border-gray focus:border-sec'
            }
            `}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
        />
      </div>
      {changed && (
        <span className="font-bold text-sm text-warning">{validations[0]}</span>
      )}
    </div>
  )
}

export const Form = ({ className = '', children }) => (
  <div
    className={`items-center h-full w-full bg-gray-light flex-grow justify-center ${className}`}
  >
    <div className="max-w-sm w-full p-8 bg-white rounded-lg shadow-md">
      {children}
    </div>
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
type UseForm = (form: {
  [field: string]: { constraints: string; label: string; type?: string }
}) => any
export const useForm: UseForm = (form) => {
  const initialState = Object.keys(form).reduce(
    (acc, k) => ((acc[k] = ''), acc),
    {},
  )
  const reducer = (
    state: { [field in keyof typeof form]: string },
    { type, payload },
  ) => ({ ...state, [type]: payload })
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const valid = Object.keys(state)
    .map((field) => validate(field, state[field], form[field].constraints))
    .every((v) => v.length === 0)

  const inputs = Object.entries(form).reduce((acc, [field, v]) => {
    acc[field] = {
      label: v.label,
      type: v.type ?? 'text',
      constraints: v.constraints,
      dispatch: (value: string) => dispatch({ type: field, payload: value }),
      value: state[field],
    }
    return acc
  }, {})

  return { valid, state, ...inputs }
}
