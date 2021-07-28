import React from 'react'
import axios from 'axios'

import { Icon } from '@/components'
import { StrapiCoupon } from '@/utils/models'

import { Coupon, Field } from './types'
import { validate, cleanField } from './useFields'

export const Checkbox = ({
  value = false,
  onChange,
  label,
  color = undefined,
  children = undefined,
  className = 'flex-wrap',
}) => (
  <button
    onClick={() => onChange(!value)}
    aria-label={`Toggle ${label} checkbox`}
  >
    <input className="hidden" type="checkbox" checked={value} readOnly={true} />
    <div className={`flex-row items-center ${className}`}>
      <div className="items-center flex-shrink-0 justify-center w-5 h-5 bg-white border border-black rounded-sm">
        {value && <Icon name="check" className="w-3 h-3" style={{ color }} />}
      </div>
      &nbsp;&nbsp;
      <span className="inline">{label}</span>
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
  const onChange_ = (e) => {
    setChanged(true)
    onChange(e.target.value)
  }
  const validations = validate(label, value, constraints)
  const required = /required/.test(constraints)

  return (
    <div
      className={`relative my-2 w-full
        ${className}
        ${focus ? 'outline-black' : ''}
        `}
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
        className={`rounded-sm border-sec absolute z-10 left-0 px-2 transform duration-200 pointer-events-none w-full h-full flex items-center overflow-hidden
          ${focused ? 'text-sec' : 'text-gray'}
          `}
        style={{
          ...(focused || value
            ? { transform: 'translate(-5%, -50%) scale(0.9)' }
            : { transform: 'translate(-0px, -0px) ' }),
        }}
      >
        <span
          className={`px-1 leading-none
         ${disabled ? 'bg-gray-light' : 'bg-white'} `}
        >
          {changed && validations.length ? (
            <Warning>{validations[0]}</Warning>
          ) : (
            <>
              {label}
              {required ? <span className="text-base">*</span> : null}
            </>
          )}
        </span>
      </label>

      <div
        className={`w-full h-full flex-row justify-between items-center border rounded-sm transform duration-200
          ${focused ? 'border-sec' : ''}
          ${
            changed && validations.length > 0 ? 'border-warning' : 'border-gray'
          }
          `}
      >
        {before && <div className="ml-2">{before}</div>}
        <input
          {...props}
          disabled={disabled}
          className={`p-2 py-3 w-full h-full outline-none
            ${disabled ? 'bg-gray-light' : 'bg-white'}
          `}
          id={field}
          name={field}
          type={type}
          value={value}
          onChange={onChange_}
          // Only show outline when navigating by keyboard
          onMouseDown={() => setMouse(true)}
          onMouseUp={() => setMouse(false)}
          onFocus={() => !mouse && setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        {children}
        {after && <div className="mr-2">{after}</div>}
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
  onSubmit = (..._: any[]) => {},
  className = '',
  children,
  ...props
}) => (
  <div className={`items-center ${className}`}>
    <form
      className="w-full max-w-sm relative"
      onSubmit={(e) => {
        onSubmit(e)
        e.preventDefault()
      }}
      {...props}
    >
      <div className="w-full p-6 bg-white rounded-lg">{children}</div>
    </form>
  </div>
)

export const FormHeader = ({ label }) => (
  <>
    {/* <div className="items-center text-pri -mb-6"> */}
    {/*   <Icon name="logo" size={64} /> */}
    {/* </div> */}
    <span className="text-center font-subheader-light text-3xl mb-4">
      {label}
    </span>
  </>
)

// TODO: should this prevent default?
export const Submit = ({
  children = 'Submit' as any,
  disabled = false,
  className = '',
  onSubmit = (..._: any) => {},
}) => (
  <button
    aria-label="Submit form"
    className={`p-3 text-white mt-2 rounded-sm border transition duration-200
      ${
        disabled
          ? 'border-pri-light bg-pri-light'
          : 'border-pri bg-pri hover:border-sec hover:bg-sec'
      }
      ${className}
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

export const Password = (props) => {
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false)
  return (
    <Input
      {...props}
      type={passwordVisible ? 'text' : 'password'}
      after={
        <PasswordVisible
          passwordVisible={passwordVisible}
          setPasswordVisible={setPasswordVisible}
        />
      }
    />
  )
}

export const PasswordVisible = ({ passwordVisible, setPasswordVisible }) => (
  <button
    aria-label="Toggle password visibility"
    className="flex flex-row items-center h-full"
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

// TODO: Dropdown always scrolls to bottom. Looks like firefox bug.
export const Dropdown = ({ value, onChange, values, ...props }) => {
  const [dropdown, setDropdown] = React.useState(false)

  return (
    <div
      className="relative w-full"
      tabIndex={0}
      onBlur={() => setDropdown(false)}
    >
      <div
        className="relative"
        onClick={() => {
          setDropdown((state) => !state)
        }}
      >
        <Input
          {...(props as any)}
          onChange={onChange}
          value={values.find((v) => v.key === value)?.label || ''}
          after={<Icon name="down" size={16} className="mt-1" />}
          className="cursor-pointer"
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
        {values.map((value) => (
          <button
            key={value.key}
            tabIndex={0}
            aria-label="Dropdown sizes"
            onClick={(e) => {
              setDropdown(false)
              onChange(value.key)
            }}
            className="flex cursor-pointer bg-white px-2"
          >
            {value.label}
          </button>
        ))}
      </div>
    </div>
  )
}

type CouponStatus = undefined | 'success' | 'failure'

export const CouponCode = ({
  situation,
  price,
  setCoupon,
  field,
}: {
  situation: StrapiCoupon['situation']
  price: number
  setCoupon: (coupon: Coupon) => void
  field: Field
}) => {
  const [status, setStatus] = React.useState<CouponStatus>()
  const checkPromo = async () => {
    const code = cleanField(field)
    return axios
      .post(`/coupons/discount`, {
        code,
        situation,
        price,
      })
      .then((res) => res.data)
      .then((data) => {
        if (data.valid) {
          setCoupon(data)
          setStatus('success')
        } else {
          setStatus('failure')
        }
      })
      .catch((err) => {
        if (err.valid === false) {
          setStatus('failure')
        }
      })
  }

  if (status === undefined) {
    return (
      <Input
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            e.preventDefault()
            checkPromo()
          }
        }}
        {...field}
        after={
          <button
            className="flex px-4 py-3 border-l border-gray"
            onClick={checkPromo}
            type="button"
          >
            Apply
          </button>
        }
      />
    )
  } else if (status === 'success') {
    return <span className="w-full p-2">Successfully applied promo code!</span>
  } else {
    return (
      <span className="text-warning w-full p-2">
        Unable to find promo code matching {field.value}.{' '}
        <button
          className="underline text-black"
          onClick={() => {
            field.onChange('')
            setStatus(undefined)
          }}
        >
          Try Again?
        </button>
      </span>
    )
  }
}

export default Form
